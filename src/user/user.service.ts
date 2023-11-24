/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// user/user.service.ts
/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { User, UserDocument, UserModel } from './user.model';
import { Logger } from '../common/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel, private readonly logger: Logger) {}

  async getUser(username: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({username});
    //   console.log("user data - service",user);
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

  async getUserProfile(username: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({username});
    //   console.log("user data - service",user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`User Profile fetched: ${username}`);
      user.password="*******"
      return user; 
    } catch (error) {
      this.logger.error(error.message, 'UserService.getUser');
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userWithHashedPassword = { ...createUserDto, password: hashedPassword };

      const createdUser = new this.userModel(userWithHashedPassword);
      const result = await createdUser.save();
      return result;
    } catch (error) {
      if (error.code === 11000) {
        // If it's a duplicate key error, handle it accordingly
        throw new ConflictException('Username or email is already taken');
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

  async changePassword(username: string, changePassword: ChangePasswordDto): Promise<UserDocument> {
    try {
      const user = await this.getUser(username);
      const newPassword = await bcrypt.hash(changePassword.password, 10);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!await bcrypt.compare(changePassword.oldPassword, user.password)) {
        throw new BadRequestException('Incorrect old password');
      }
      user.password = newPassword;
      const updatedUser = await this.userModel.findOneAndUpdate({ username }, user, { new: true });

      this.logger.log(`password changed for : ${username}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(error.message, 'UserService.changePassword');
      throw error;
    }
  }

  async updateSessionToken(username: string, sessionToken: string): Promise<void> {
    await this.userModel.updateOne({ username }, { $set: { sessionToken } });
  }

  async findBySessionToken(sessionToken: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ sessionToken }).exec();
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
