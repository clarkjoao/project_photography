import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({default:''})
  name: string;
  
  @Prop({default:''})
  location: string;

  @Prop({default:''})
  link: string;

  @Prop({default:''})
  date: Date;
  
  @Prop({default: 0})
  photoCounter: number;
  
  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);