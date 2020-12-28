import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ImagesService {
    constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    @InjectQueue('Images') private imagesQueue: Queue
    ) {}
    async create(doc: Image, file: File) {
        const result = await new this.imageModel(doc).save();
        await this.imagesQueue.add({image: file, id:result.id})
        return result.id;
    }

    async findById(id: number){
    }

    async update(image: Image) {
    // ...
    }

    async remove(image: Image) {
    // ...
    }
}
