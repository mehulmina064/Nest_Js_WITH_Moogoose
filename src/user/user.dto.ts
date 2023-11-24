/* eslint-disable prettier/prettier */
// user/dto/create-user.dto.ts
import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches, isEmpty, IsEmpty, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
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

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsPhoneNumber('IN', { message: 'Invalid Indian phone number' })
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly company?: string;

  @IsString()
  @IsOptional()
  readonly entity?: string;

  @IsEmpty()
  readonly password?: string;
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/, { message: 'Password must contain at least one letter, one number, and one special character' })
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;
  }
