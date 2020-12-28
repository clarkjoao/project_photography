import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';

import { ImagesModule } from './images/images.module';
import { ImagesConvertService } from './shared/services/images-convert/images-convert.service';

import { AlbunsModule } from './albuns/albuns.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  ConfigModule.forRoot(),
  MongooseModule.forRoot('mongodb+srv://db_user:ZGgPHF5gWxN6lKBW@anaphotos.uonq9.mongodb.net/db_user?retryWrites=true&w=majority'),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
  UsersModule, 
  ImagesModule,
  AlbunsModule, 
  AuthModule],
  providers: [ImagesConvertService],
})
export class AppModule {}
