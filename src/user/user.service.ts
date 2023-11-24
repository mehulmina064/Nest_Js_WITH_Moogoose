/* eslint-disable prettier/prettier */
// user/user.service.ts
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User, UserDocument, UserModel } from './user.model';
import { Logger } from '../common/logger.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel, private readonly logger: Logger) {}

  async getUser(username: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`User fetched: ${username}`);
      return user;
    } catch (error) {
      this.logger.error(error.message, 'UserService.getUser');
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const result = await createdUser.save();
      return result;
    } catch (error) {
      if (error.code === 11000) {
        // If it's a duplicate key error, handle it accordingly
        throw new ConflictException('Username is already taken');
      }
      // For other errors, rethrow them
      throw error;
    }
  }

  async updateUser(username: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ username }, updateUserDto, { new: true });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`User updated: ${username}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(error.message, 'UserService.updateUser');
      throw error;
    }
  }

  async partialUpdateUser(username: string, partialUpdateUserDto: Partial<UpdateUserDto>): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ username }, partialUpdateUserDto, { new: true });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`User partially updated: ${username}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(error.message, 'UserService.partialUpdateUser');
      throw error;
    }
  }

  async deleteUser(username: string): Promise<UserDocument> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ username });
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`User deleted: ${username}`);
      return deletedUser;
    } catch (error) {
      this.logger.error(error.message, 'UserService.deleteUser');
      throw error;
    }
  }
}
