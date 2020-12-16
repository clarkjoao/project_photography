import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album,AlbumDocument } from './schemas/album.schemas';

@Injectable()
export class AlbunsService {
    constructor(
    @InjectModel(Album.name) private readonly userModel: Model<AlbumDocument>,
    ) {}
    async create(doc: Album) {
        const result = await new this.userModel(doc).save();
        return result.id;
    }

    async findById(id: number) {
    // ...
    }

    async update(user: Album) {
    // ...
    }

    async remove(user: Album) {
    // ...
        }
}
