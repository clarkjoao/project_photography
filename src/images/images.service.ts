import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ImagesDTO, ImageQueeDTO } from './dtos/images.dto'
import { AlbunsService } from 'src/albuns/albuns.service';

@Injectable()
export class ImagesService {
    constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    @InjectQueue('Images') private imagesQueue: Queue,
    private albunsService: AlbunsService,
    ) {}
    async create(image: ImagesDTO, file: Buffer) {
        
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
        await this.imagesQueue.add(imageQuee)

        return id;
    }

    async findById(id: string){
        const image = await this.imageModel.findOne({_id:id}).exec();
        return image
    }

    async update(image: ImagesDTO) {
    // ...
    }

    async remove(image: Image) {
    // ...
    }
}
