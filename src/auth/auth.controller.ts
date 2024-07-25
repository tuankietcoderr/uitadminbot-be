import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  Version
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SESSION_NAME } from 'src/shared/constants';
import { CurrentUser, Public } from 'src/shared/decorators';
import { User } from 'src/shared/entities';
import { GoogleOAuthGuard, LocalAuthGuard } from 'src/shared/guards';
import { IGoogleLoginResponse } from 'src/shared/interfaces';
import { SuccessResponse } from 'src/shared/responses';
import { AuthService } from './auth.service';
import { AdminRegisterDto, ChatUserRegisterDto, RefreshTokenDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    return new SuccessResponse(await this.authService.login(user)).setMessage('Logged in successfully');
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('login/google')
  async googleLogin(@CurrentUser() user: User) {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('login/google/callback')
  async googleLoginRedirect(@CurrentUser() user: IGoogleLoginResponse) {
    return new SuccessResponse(await this.authService.googleLogin(user)).setMessage('Google logged in successfully');
  }

  @Get('me')
  async currentUser(@CurrentUser() user: User) {
    return new SuccessResponse(user).setMessage('User fetched successfully');
  }

  @Post('register-admin')
  async createAdmin(@Body() data: AdminRegisterDto) {
    return new SuccessResponse(await this.authService.createAdmin(data))
      .setMessage('Admin created successfully')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Public()
  @Post('register-chat-user')
  async createChatUser(@Body() data: ChatUserRegisterDto) {
    return new SuccessResponse(await this.authService.createChatUser(data))
      .setMessage('Chat user created successfully')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return new SuccessResponse(await this.authService.refreshToken(data.refreshToken)).setMessage(
      'Token refreshed successfully'
    );
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(function (err) {
      if (err) {
        return res.send(new InternalServerErrorException(err.message));
      }
    });

    return res.clearCookie(SESSION_NAME).send(new SuccessResponse(null, 'Logged out successfully'));
  }
}
