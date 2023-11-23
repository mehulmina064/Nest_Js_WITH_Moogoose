/* eslint-disable prettier/prettier */
// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import { JwtPayload } from '../user/user.model';
import { Logger } from '../common/logger.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly logger: Logger) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUser(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateJwtUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.getUser(payload.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        entity: user.entity,
      };
    const access_token = this.jwtService.sign(payload);
    this.logger.log(`User logged in: ${user.username}`);
    return { access_token };
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const createdUser = await this.userService.createUser(createUserDto);

    // Log the successful registration
    this.logger.log(`User registered: ${createdUser.username}`);

    return createdUser;
  }
}
