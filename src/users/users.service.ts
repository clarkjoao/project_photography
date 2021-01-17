import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { MongoExceptionFilter } from  'src/shared/exception/mongo-exception.filter'
import { User, UserDocument } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';

import { UserDTO } from './dtos/user.dto'

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}
    async create(user: UserDTO) {
        const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT)||10);

        user.password = hashedPassword

        const newUser = await new this.userModel(user).save();

        return newUser.id;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email}).exec()
        
        // if (!user) {
        //     throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
        // }

        return user;
    }

    async findById(id: string) {
        
        const user = await this.userModel.findOne({_id:id}).exec()
        // if (!user) {
        //     console.log('exception')
        //     throw new MongoExceptionFilter()
        // }

        const {name, email} = user
        return {id, name, email};
    }

    async update(id: string, user: UserDTO) {

        const userUpdated = await this.userModel.findOneAndUpdate({_id: id}, user,{new: true}).exec();

        // if (!userUpdated) {
        //     throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
        // }

        return userUpdated;
    }

    async remove(id: string) {

        const userDeleted = await this.userModel.findOneAndRemove({_id: id}).exec();

        // if (!userDeleted) {
        //     throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
        // }

        return id;
    }
}
