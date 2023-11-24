/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// user/user.controller.ts
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Logger } from '../common/logger.service';
import { UserService } from './user.service';
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from './user.model';
import { SessionGuard } from 'src/common/session.guard';


@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly logger: Logger) {}

  @Get('userDetails/:username')
  @UseGuards(JwtAuthGuard,SessionGuard) 
  @ApiOperation({ summary: 'Get user by username', description: 'Fetches user information based on the provided username.' })
  @ApiParam({ name: 'username', description: 'Username of the user to fetch.' })
  @ApiResponse({ status: 200, description: 'User information successfully fetched.' })
  async getUser(@Request() req: any,@Param('username') username: string): Promise<any> {
    this.logger.log(`Fetching user: ${username}`);
    return this.userService.getUserProfile(username);
  }

  @Post("userDetails/")
  @UseGuards(JwtAuthGuard,SessionGuard) 
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'secure_password' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string', example: '1234567890' },
        company: { type: 'string', example: 'Example Company' },
        entity: { type: 'string', example: 'Example Entity' },
      },
    },
    description: 'User data to create a new user.',
  })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async createUser(@Request() req: any,@Body() createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Creating user: ${createUserDto.username}`);
    return this.userService.createUser(createUserDto);
  }

  @Put('userDetails/:username')
  @UseGuards(JwtAuthGuard,SessionGuard) 
  @ApiOperation({ summary: 'Update user', description: 'Updates user information based on the provided username.' })
  @ApiParam({ name: 'username', description: 'Username of the user to update.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Name' },
        email: { type: 'string', example: 'updated_email@example.com' },
        phone: { type: 'string', example: '9876543210' },
        company: { type: 'string', example: 'Updated Company' },
        entity: { type: 'string', example: 'Updated Entity' },
      },
    },
    description: 'User data to update an existing user.',
  })
  @ApiResponse({ status: 200, description: 'User information successfully updated.' })
  async updateUser(@Request() req: any,@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    this.logger.log(`Updating user: ${username}`);
    return this.userService.updateUser(username, updateUserDto);
  }

  @Patch('userDetails/:username')
  @UseGuards(JwtAuthGuard,SessionGuard) 
  @ApiOperation({ summary: 'Partial update user', description: 'Partially updates user information based on the provided username.' })
  @ApiParam({ name: 'username', description: 'Username of the user to partially update.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Partial Updated Name' },
        email: { type: 'string', example: 'partial_updated_email@example.com' },
      },
    },
    description: 'Partial user data to update an existing user.',
  })
  @ApiResponse({ status: 200, description: 'User information successfully partially updated.' })
  async partialUpdateUser(@Request() req: any,@Param('username') username: string, @Body() partialUpdateUserDto: Partial<UpdateUserDto>): Promise<any> {
    this.logger.log(`Partially updating user: ${username}`);
    return this.userService.partialUpdateUser(username, partialUpdateUserDto);
  }

  @Delete('userDetails/:username')
  @UseGuards(JwtAuthGuard,SessionGuard) 
  @ApiOperation({ summary: 'Delete user', description: 'Deletes user based on the provided username.' })
  @ApiParam({ name: 'username', description: 'Username of the user to delete.' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  async deleteUser(@Request() req: any,@Param('username') username: string): Promise<any> {
    this.logger.log(`Deleting user: ${username}`);
    return this.userService.deleteUser(username);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user', description: 'Registers a new user.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'secure_password' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string indian number', example: '1234567890' },
        company: { type: 'string', example: 'Example Company' },
        entity: { type: 'string', example: 'Example Entity' },
      },
    },
    description: 'User data to register a new user.',
  })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Registering user: ${createUserDto.username}`);
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Logs in a user using local authentication.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'secure_password' },
      }, 
    },
    description: 'User data to log in a user.',
  })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  async login(@Request() req: any): Promise<{ access_token: string }> {
    this.logger.log(`User logged in: ${req.user.username}`);
    return this.authService.login(req.user);
  }
  
  @UseGuards(JwtAuthGuard,SessionGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile', description: 'Fetches the profile of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User profile successfully fetched.' })
  async getProfile(@Request() req: any): Promise<UserDocument> {
    // console.log('req.user in controller:', req.user);
    return await this.userService.getUserProfile(req.user.username);
  }
  
  @UseGuards(JwtAuthGuard,SessionGuard)
  @Patch('profile')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Name' },
        email: { type: 'string', example: 'updated_email@example.com' },
        phone: { type: 'string', example: '9876543210' },
        company: { type: 'string', example: 'Updated Company' },
        entity: { type: 'string', example: 'Updated Entity' },
      },
    },
    description: 'User data to update my Profile .',
  })
  @ApiOperation({ summary: 'Get user profile', description: 'Fetches the profile of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User profile successfully fetched.' })
  async updateProfile(@Request() req: any,@Body() partialUpdateUserDto: UpdateUserDto): Promise<UserDocument> {
    // console.log('req.user in controller:', req.user);
    return this.userService.partialUpdateUser(req.user.username, partialUpdateUserDto);
  }

  @UseGuards(JwtAuthGuard,SessionGuard)
  @Patch('changePassword')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'secure_password' },
        oldPassword: { type: 'string', example: 'secure_password' },
      },
    },
    description: 'Update my password.',
  })
  @ApiOperation({ summary: 'Get user profile', description: 'Fetches the profile of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User profile successfully fetched.' })
  async changePassword(@Request() req: any,@Body() changePassword: ChangePasswordDto): Promise<UserDocument> {
    // console.log('req.user in controller:', req.user);
    return this.userService.changePassword(req.user.username, changePassword);
  }
  
}