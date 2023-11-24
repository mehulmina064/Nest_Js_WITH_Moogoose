/* eslint-disable prettier/prettier */
// auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import { JwtPayload } from '../user/user.model';
import { Logger } from '../common/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly logger: Logger) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
    const user = await this.userService.getUser(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    }
    catch (error) {
        throw new UnauthorizedException('Invalid credentials');
    }
  }

async validateJwtUser(payload: JwtPayload): Promise<any> {
    try {
  const user = await this.userService.getUser(payload.username);

  if (!user) {
    this.logger.warn(`User not found for JWT payload: ${payload.username}`);
    throw new UnauthorizedException('Invalid credentials');
  }

  return user;
}
catch (error) {
    throw new UnauthorizedException('Invalid credentials - ' + error.message);
}
}

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = user.toPayload()
    const access_token = this.jwtService.sign(payload);
    this.logger.log(`User logged in: ${user.username}`);
    return { access_token };
  }
// auth.service.ts
async registerUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const createdUser = await this.userService.createUser(createUserDto);
  
      // Log the successful registration
      this.logger.log(`User registered: ${createdUser.username}`);
  
      return createdUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        // If it's a MongoServerError with duplicate key error, handle it accordingly
        throw new ConflictException('Username or email already exists. Please choose a different one.');
      } else {
        // For other errors, rethrow
        this.logger.error(error.message, 'AuthService.registerUser');
        throw error;
      }
    }
  }
  
}
