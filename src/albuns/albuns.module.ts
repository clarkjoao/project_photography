import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbunsController } from './albuns.controller';
import { AlbunsService } from './albuns.service';
import { Album,AlbumSchema } from './schemas/album.schemas';
@Module({
  imports: [MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }])],
  controllers: [AlbunsController],
  providers: [AlbunsService],
  exports: [AlbunsService]
})
export class AlbunsModule {}
