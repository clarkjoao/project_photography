import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { ImagesConvertService } from './shared/services/images-convert/images-convert.service';
import { AlbunsModule } from './albuns/albuns.module';

@Module({
  imports: [
  MongooseModule.forRoot('mongodb+srv://db_user:ZGgPHF5gWxN6lKBW@anaphotos.uonq9.mongodb.net/db_user?retryWrites=true&w=majority'),
   UsersModule, ImagesModule, AlbunsModule],
  controllers: [AppController],
  providers: [AppService, ImagesConvertService],
})
export class AppModule {}
