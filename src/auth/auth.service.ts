// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUser(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    // You can perform additional checks or validations here before creating the user
    return this.userService.createUser(createUserDto);
  }
}
