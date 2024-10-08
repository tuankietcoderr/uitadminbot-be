import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ERole } from 'src/shared/enums';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class AdminRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SuperAdminRegisterDto extends AdminRegisterDto {
  @IsNotEmpty()
  authKey: string;
}

export class ChatUserRegisterDto {}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
