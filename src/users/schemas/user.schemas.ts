import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required:true})
  name: string;

  @Prop({index: true, unique:true, required:true})
  email: string;

  @Prop({required:true})
  password: string;

  @Prop({default: Date.now})
  createdAt: Date;
  
  @Prop({default: Date.now})
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);