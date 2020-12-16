import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop()
  name: string;

  @Prop()
  link: string;
  
  @Prop({ref:'Album', required:true})
  album: ObjectId;

  @Prop()
  password: string;

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