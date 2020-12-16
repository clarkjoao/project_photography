import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';


@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}
    async create(doc: User) {
        const result = await new this.userModel(doc).save();
        return result.id;
    }

    async findById(id: number) {
    // ...
    }

    async update(user: User) {
    // ...
    }

    async remove(user: User) {
    // ...
    }
}
