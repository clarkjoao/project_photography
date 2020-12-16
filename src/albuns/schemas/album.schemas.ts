import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  email: number;

  @Prop()
  createdAt: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

// coverEventLink: "https://photo-upload-vaquejada-photos-prod.s3.amazonaws.com/cover/fernandoLucena.jpg"
// createdAt: 1603461346005
// eventDate: "Fri Oct 23 2020 09:55:40 GMT-0400"
// eventId: "d60fbef5-a339-4f15-b713-c023bd25a462"
// eventName: "Parque Haras Fernando Lucena"
// location: "Caruaru - PE"
// photoCounter: 10658
// pk: "EVENT#d60fbef5-a339-4f15-b713-c023bd25a462"
// sk: "#METADATA#d60fbef5-a339-4f15-b713-c023bd25a462"
// type: "EVENT"