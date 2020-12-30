import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ImagesDTO, ImageQueeDTO } from './dtos/images.dto'
import { AlbunsService } from 'src/albuns/albuns.service';
import { Multer } from 'multer';

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
            throw new HttpException('Album Not found', HttpStatus.NOT_FOUND);
        }

        const { id } = await new this.imageModel(image).save();

        const imageQuee: ImageQueeDTO = {
            albumID: album.id,
            imageID: id,
            file,
        }

        await this.imagesQueue.add('create', imageQuee)

        return id;
    }

    async findById(id: string){
        const image = await this.imageModel.findOne({_id:id}).exec();
        return image
    }

    async update(image: ImagesDTO) {
        const imageUpdated = await this.imageModel.findOneAndUpdate({_id: image.id}, image,{new: true}).exec();
        if (!imageUpdated) {
            throw new HttpException('Image Not found', HttpStatus.NOT_FOUND);
        }
        return imageUpdated;
    }

    async remove(id: string) {
        const imageDeleted = await this.imageModel.findOneAndRemove({_id: id}).exec();

        if (!imageDeleted) {
            throw new HttpException('Image Not found', HttpStatus.NOT_FOUND);
        }
        const imageQuee: ImageQueeDTO = {
            albumID: imageDeleted.id,
            imageID: imageDeleted.album,
        }

        await this.imagesQueue.add('delete',imageQuee)
        
        return id;
    }
}
