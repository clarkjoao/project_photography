import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image,ImageSchema } from './schemas/image.schemas';
import { ImagesConsumer } from './images-consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    BullModule.registerQueue({
      name: 'Images',
    })
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesConsumer]
})
export class ImagesModule {}
