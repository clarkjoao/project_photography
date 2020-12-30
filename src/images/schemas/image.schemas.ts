import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types} from 'mongoose';
import { Album } from 'src/albuns/schemas/album.schemas';


export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({default:''})
  name: string;

  @Prop({default:''})
  link: string;
  
  @Prop({type: Types.ObjectId, ref: Album.name, required:true})
  album: string;

  @Prop({default:false})
  isPublished: boolean;

  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);