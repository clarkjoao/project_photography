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
  MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
  BullModule.forRoot({
    redis: {
      host: `${process.env.REDIS_HOST}`,
      port: parseInt(process.env.REDIS_PORT),
    },
  }),
  UsersModule, 
  ImagesModule,
  AlbunsModule, 
  AuthModule],
  providers: [ImagesConvertService],
})
export class AppModule {}
