import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({required:true})
  name: string;
  
  @Prop({required:true})
  location: string;

  @Prop({required:true})
  coverLink: string;

  @Prop({required:true})
  date: Date;
  
  @Prop({required:true})
  photoCounter: number;
  
  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);