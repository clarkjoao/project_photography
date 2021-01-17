import { MongoError } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Album, AlbumDocument } from './schemas/album.schemas';
import { AlbunsDTO } from './dtos/albuns.dto'
import { UploadQueeDTO } from 'src/shared/dtos/uploadquee.dto'

@Injectable()
export class AlbunsService {
    constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectQueue('Albuns') private albunsQueue: Queue,
    ) {}
    async create(album: AlbunsDTO, file: Express.Multer.File) {

        const { id } = await new this.albumModel(album).save();

        if(file){

            const imageQuee: UploadQueeDTO = {
                albumID: id,
                imageID: id,
                file,
            }
    
            await this.albunsQueue.add('create', imageQuee)
        }

        return id;
    }

    async findById(id: string) {

        const album = await this.albumModel.findOne({_id:id}).exec();

        if (!album) {
            throw new MongoError('Album Not found');
        }

        return album;
    }

    async findAll(page: number = 0){

        const resultsPerPage = parseInt(process.env.QNT_BY_PAGE)||25;

        const result = this.albumModel.find()
        .sort({ createdAt: "desc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .exec()
        
        return result
    }

    async update(id:string ,album: AlbunsDTO) {
       
        const albumUpdated = await this.albumModel.findOneAndUpdate({_id: id}, album,{new: true}).exec();

        if (!albumUpdated) {
            throw new MongoError('Album Not found');
        }

        return albumUpdated;
    }

    async incrasePhotoCount(id: string, photoCounter:number = 1){

        const albumUpdated = await this.albumModel.findOneAndUpdate({_id: id}, {$inc:{ photoCounter }},{new: true}).exec();

        if (!albumUpdated) {
            throw new MongoError('Album Not found');
        }

        return albumUpdated;
    }

    async remove(id: string) {

        const albumDeleted = await this.albumModel.findOneAndDelete({_id: id}).exec();

        if (!albumDeleted) {
            throw new MongoError('Album Not found');
        }

        const albumQuee: UploadQueeDTO = {
            albumID: albumDeleted.id,
            imageID: albumDeleted.id,
        }

        await this.albunsQueue.add('delete', albumQuee)
        
        return id;
    }
}
