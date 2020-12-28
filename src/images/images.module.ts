import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bull';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image,ImageSchema } from './schemas/image.schemas';
import { ImagesConsumer } from './images-consumer';
import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    BullModule.registerQueue({
      name: 'Images',
    }),
    ImagesConvertService
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesConsumer,ImagesConvertService]
})
export class ImagesModule {}
