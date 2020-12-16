import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';

@Injectable()
export class ImagesService {
    constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    ) {}
    async create(doc: Image) {
        const result = await new this.imageModel(doc).save();
        return result.id;
    }

    async findById(id: number) {
        // ...
    }

    async update(image: Image) {
    // ...
    }

    async remove(image: Image) {
    // ...
    }
}
