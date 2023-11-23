/* eslint-disable prettier/prettier */
// user/user.controller.ts
import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  getUser(@Param('username') username: string): Promise<any> {
    return this.userService.getUser(username);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':username')
  updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.updateUser(username, updateUserDto);
  }

  @Patch(':username')
  partialUpdateUser(@Param('username') username: string, @Body() partialUpdateUserDto: Partial<UpdateUserDto>): Promise<any> {
    return this.userService.partialUpdateUser(username, partialUpdateUserDto);
  }

  @Delete(':username')
  deleteUser(@Param('username') username: string): Promise<any> {
    return this.userService.deleteUser(username);
  }
}
