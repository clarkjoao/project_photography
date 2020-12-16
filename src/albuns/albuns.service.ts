import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument } from './schemas/album.schemas';
import Album from './albuns.dto'
@Injectable()
export class AlbunsService {
    constructor(
    @InjectModel('Album') private readonly userModel: Model<AlbumDocument>,
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
