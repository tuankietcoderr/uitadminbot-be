import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  Version
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser, Public } from 'src/shared/decorators';
import { Admin, User } from 'src/shared/entities';
import { LocalAuthGuard } from 'src/shared/guards';
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
    return new SuccessResponse(await this.authService.login(user)).setMessage('Đăng nhập thành công');
  }

  @Get('me')
  async currentUser(@CurrentUser() user: User) {
    return new SuccessResponse(user);
  }

  @Public()
  @Post('register/admin')
  async createAdmin(@Body() data: AdminRegisterDto) {
    return new SuccessResponse(await this.authService.createAdmin(data))
      .setMessage('Admin được tạo thành công')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Public()
  @Post('register/chat-user')
  async createChatUser(@Body() data: ChatUserRegisterDto) {
    return new SuccessResponse(await this.authService.createChatUser(data))
      .setMessage('Người dùng chat được tạo thành công')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return new SuccessResponse(await this.authService.refreshToken(data.refreshToken)).setMessage(
      'Token đã được cập nhật'
    );
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(function (err) {
      if (err) {
        return new InternalServerErrorException(err.message);
      }
    });

    return res.send(new SuccessResponse(true).setMessage('Đăng xuất thành công'));
  }
}
