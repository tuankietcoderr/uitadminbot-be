import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  Version
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser, Public, Roles } from 'src/shared/decorators';
import { Admin, User } from 'src/shared/entities';
import { LocalAuthGuard } from 'src/shared/guards';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';
import { AuthService } from './auth.service';
import { AdminRegisterDto, ChatUserRegisterDto, RefreshTokenDto, SuperAdminRegisterDto } from './auth.dto';
import { ERole } from 'src/shared/enums';

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
    const userChatRoom = await this.authService.getChatUserRoom(user._id.toString());
    return new SuccessResponse({
      ...user,
      chatRoom: userChatRoom.id
    });
  }

  @Public()
  @Post('register/super-admin')
  async createSuperAdmin(@Body() data: SuperAdminRegisterDto) {
    return new SuccessResponse(await this.authService.createSuperAdmin(data))
      .setMessage('Super Admin được tạo thành công')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Roles([ERole.SUPER_ADMIN])
  @Post('register/admin')
  async createAdmin(@Body() data: AdminRegisterDto) {
    return new SuccessResponse(await this.authService.createAdmin(data))
      .setMessage('Admin được tạo thành công')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Roles([ERole.SUPER_ADMIN])
  @Get('admin')
  async getAdmins(
    @Query(
      'page',
      new ParseIntPipe({
        optional: true
      })
    )
    page: number = 1,
    @Query(
      'limit',
      new ParseIntPipe({
        optional: true
      })
    )
    limit: number = 10,
    @Query('keyword') keyword: string = ''
  ) {
    const totalDocuments = await this.authService.countAdminList(keyword);
    return new PaginateResponse(
      await this.authService.getAdmins({
        page,
        limit,
        keyword
      }),
      {
        page,
        limit,
        totalDocuments
      }
    ).setMessage('Danh sách Admin');
  }

  @Roles([ERole.SUPER_ADMIN])
  @Put('admin/:id')
  async banAdmin(@Param('id') id: string) {
    const res = await this.authService.banAdmin(id);
    return new SuccessResponse(res).setMessage(`Admin đã ${res.isBanned ? 'bị cấm' : 'được phục hồi'}`);
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
