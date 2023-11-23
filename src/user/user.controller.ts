/* eslint-disable prettier/prettier */
// user/user.controller.ts
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Assuming you are using Passport for authentication
import { Logger } from '../common/logger.service'; // Import your Logger service
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';


@Controller('user')
@UseGuards(AuthGuard()) 
export class UserController {
  constructor(private readonly authService: AuthService,private readonly userService: UserService, private readonly logger: Logger) {}

  @Get(':username')
  getUser(@Param('username') username: string): Promise<any> {
    this.logger.log(`Fetching user: ${username}`);
    return this.userService.getUser(username);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Creating user: ${createUserDto.username}`);
    return this.userService.createUser(createUserDto);
  }

  @Put(':username')
  updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    this.logger.log(`Updating user: ${username}`);
    return this.userService.updateUser(username, updateUserDto);
  }

  @Patch(':username')
  partialUpdateUser(@Param('username') username: string, @Body() partialUpdateUserDto: Partial<UpdateUserDto>): Promise<any> {
    this.logger.log(`Partially updating user: ${username}`);
    return this.userService.partialUpdateUser(username, partialUpdateUserDto);
  }

  @Delete(':username')
  deleteUser(@Param('username') username: string): Promise<any> {
    this.logger.log(`Deleting user: ${username}`);
    return this.userService.deleteUser(username);
  }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Registering user: ${createUserDto.username}`);
    return this.authService.registerUser(createUserDto);
  }


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any): Promise<{ access_token: string }> {
    this.logger.log(`User logged in: ${req.user.username}`);
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Request() req: any): any {
    return req.user;
  }
}
