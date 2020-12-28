import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types} from 'mongoose';
import { Album } from 'src/albuns/schemas/album.schemas';


export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({required:true})
  name: string;

  @Prop({default:''})
  link: string;
  
  @Prop({type: Types.ObjectId, ref: Album.name, required:true})
  album: Album;

  @Prop({default:false})
  isPublished: boolean;

  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);


// category: "Aspirante"
// name: "_GSG2970"
// photoId: "001056fa-bac5-4467-89be-52e18ebc7a1b"
// s3Link: "https://photo-upload-vaquejada-photos-prod.s3.amazonaws.com/optimized/4ddde9a8-4812-4c0e-9ff7-b90f693bc78b/_GSG2970.jpg"
// sk: "PHOTO#001056fa-bac5-4467-89be-52e18ebc7a1b"