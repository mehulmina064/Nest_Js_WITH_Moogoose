/* eslint-disable prettier/prettier */
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface JwtPayload {
  username: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  entity: string;
}

export interface UserDocument extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  entity: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isDeleted: boolean;

  toPayload(): JwtPayload;
}

export interface UserModel extends Model<UserDocument> {
  findByUserName(username: string): Promise<UserDocument[]>;
}

export const UserSchema = new Schema<UserDocument, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    company: String,
    entity: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now,
      },
    isDeleted :{
        type: Boolean,
        default: false,
      },
  },
  {
    versionKey: false,
    methods: {
      toPayload(): JwtPayload {
        return {
          username: this.username,
          name: this.name,
          email: this.email,
          phone: this.phone,
          company: this.company,
          entity: this.entity,
        };
      },
    },
    statics: {
        findByUserName(username: string): Promise<UserDocument[]> {
          return this.find({ username: new RegExp(username, 'i') }).exec();
        },
      },      
  }
);

export const User = mongoose.model<UserDocument, UserModel>('users', UserSchema);

export default User;
