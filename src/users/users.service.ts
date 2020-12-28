import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}
    async create(doc: User) {
        const hashedPassword = await bcrypt.hash(doc.password, parseInt(process.env.BCRYPT_SALT)||10);
        const user = {...doc, password: hashedPassword}
        const result = await new this.userModel(user).save();
        return result.id;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email}).exec()
        return user;
    }
    async findById(id: number) {
        const user = await this.userModel.findOne({_id:id}).exec()
        const {name, email} = user
        return {id, name, email};
    }

    async update(user: User) {
    // ...
    }

    async remove(user: User) {
    // ...
    }
}
