import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { AlbunsController } from './albuns.controller';
import { AlbunsService } from './albuns.service';
import { Album, AlbumSchema } from './schemas/album.schemas';
import { AlbunsConsumer } from './albuns-consumer';


import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    BullModule.registerQueue({
      name: 'Albuns',
      limiter:{
        max: parseInt(process.env.QUEE_RATELIMIT)|| 5,
        duration: parseInt(process.env.QUEE_TIMEOUT)|| 10000,
      }
    }),
    ImagesConvertService
  ],
  controllers: [AlbunsController],
  providers: [AlbunsService, AlbunsConsumer, ImagesConvertService],
  exports: [AlbunsService]
})
export class AlbunsModule {}
