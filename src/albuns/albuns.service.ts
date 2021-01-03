import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

        if(!file){
            throw new HttpException('Missing File', HttpStatus.FORBIDDEN);
        }

        const { id } = await new this.albumModel(album).save();

        const imageQuee: UploadQueeDTO = {
            albumID: id,
            imageID: id,
            file,
        }

        await this.albunsQueue.add('create', imageQuee)

        return id;
    }

    async findById(id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const album = await this.albumModel.findOne({_id:id}).exec();

        if (!album) {
            throw new HttpException('Album Not found', HttpStatus.NOT_FOUND);
        }

        return album;
    }

    async update(id:string ,album: AlbunsDTO) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const albumUpdated = await this.albumModel.findOneAndUpdate({_id: id}, album,{new: true}).exec();

        if (!albumUpdated) {
            throw new HttpException('Album Not found', HttpStatus.NOT_FOUND);
        }

        return albumUpdated;
    }

    async remove(id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const albumDeleted = await this.albumModel.findOneAndRemove({_id: id}).exec();

        if (!albumDeleted) {
            throw new HttpException('Album Not found', HttpStatus.NOT_FOUND);
        }

        if(albumDeleted.link){

            const albumQuee: UploadQueeDTO = {
                albumID: albumDeleted.id,
                imageID: albumDeleted.id,
            }
    
            await this.albunsQueue.add('delete', albumQuee)
        }
        
        return id;
    }
}
