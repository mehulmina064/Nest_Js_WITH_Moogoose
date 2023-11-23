/* eslint-disable prettier/prettier */
// user/dto/create-user.dto.ts
import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/, { message: 'Password must contain at least one letter, one number, and one special character' })
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber('IN', { message: 'Invalid Indian phone number' })
  readonly phone: string;

  @IsString()
  readonly company: string;

  @IsString()
  readonly entity: string;
}


  
// user/dto/update-user.dto.ts

export class UpdateUserDto {
  @IsString()
  readonly name?: string;

  @IsEmail()
  readonly email?: string;

  @IsPhoneNumber('IN', { message: 'Invalid Indian phone number' })
  readonly phone?: string;

  @IsString()
  readonly company?: string;

  @IsString()
  readonly entity?: string;
}
