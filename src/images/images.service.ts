import { MongoError } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ImagesDTO } from './dtos/images.dto'
import { AlbunsService } from 'src/albuns/albuns.service';
import { UploadQueeDTO } from 'src/shared/dtos/uploadquee.dto'

@Injectable()
export class ImagesService {
    constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    @InjectQueue('Images') private imagesQueue: Queue,
    private albunsService: AlbunsService,
    ) {}
    async create(image: ImagesDTO, file: Express.Multer.File) {

        const album = await this.albunsService.findById(image.album);

        if(!album){
            throw new MongoError('Album Not found');
        }

        const newImage = await new this.imageModel(image).save();

        const imageQuee: UploadQueeDTO = {
            albumID: album.id,
            imageID: newImage.id,
            file,
        }

        await this.imagesQueue.add('create', imageQuee)

        return newImage;
    }

    async findById(id: string){

        const image = await this.imageModel.findOne({_id:id}).exec();

        if(!image){
            throw new MongoError('Image Not found');
        }
        return image
    }

    async findAllByAlbum(id: string, page: number = 0){

        const resultsPerPage = parseInt(process.env.QNT_BY_PAGE)||25;

        const result = this.imageModel.find({ album: id })
        .sort({ createdAt: "desc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .exec()
        
        return result

    }

    async update(id: string, image: ImagesDTO) {

        const imageUpdated = await this.imageModel.findOneAndUpdate({_id: id}, image,{new: true}).exec();

        if (!imageUpdated) {
            throw new MongoError('Image Not found');
        }
        return imageUpdated;
    }

    async remove(id: string) {

        const imageDeleted = await this.imageModel.findOneAndRemove({_id: id}).exec();

        if (!imageDeleted) {
            throw new MongoError('Image Not found');
        }

        if(imageDeleted.link){

            const imageQuee: UploadQueeDTO = {
                imageID: imageDeleted.id,
                albumID: imageDeleted.album
            }
    
            await this.imagesQueue.add('delete',imageQuee)
        }
        
        return id;
    }

    async removeByAlbum(id: string) {
        const imagesDeleted = await this.imageModel.find({album: id}).remove().exec();

        return imagesDeleted;
    }
}
