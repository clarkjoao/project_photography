import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  name: string;
  
  @Prop()
  location: string;

  @Prop()
  coverLink: string;

  @Prop()
  date: Date;
  
  @Prop()
  photoCounter: number;
  
  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);