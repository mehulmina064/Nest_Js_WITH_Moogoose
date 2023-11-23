// user/user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  company: string;

  @Prop()
  entity: string;

  toPayload(): JwtPayload {
    return {
      username: this.username,
      name: this.name,
      email: this.email,
      phone: this.phone,
      company: this.company,
      entity: this.entity,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface JwtPayload {
  username: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  entity: string;
}
