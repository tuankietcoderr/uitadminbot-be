import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ShareService } from './share.service';
import { CurrentUser, Public } from 'src/shared/decorators';
import { User } from 'src/shared/entities';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  async create(@CurrentUser() user: User) {
    const share = await this.shareService.create(user._id.toString());
    return new SuccessResponse(share._id.toString()).setMessage('Tạo link chia sẻ thành công');
  }

  @Public()
  @Get(':id')
  async getShareById(@Param('id') id: string) {
    const share = await this.shareService.getShareByIdOrThrow(id);
    return new SuccessResponse(share).setMessage('Lấy thông tin chia sẻ thành công');
  }

  @Delete(':id')
  async cancelShare(@Param('id') id: string) {
    await this.shareService.cancelShare(id);
    return new SuccessResponse(null).setStatusCode(HttpStatus.NO_CONTENT);
  }

  @Get('')
  async getShares(
    @CurrentUser() user: User,
    @Query('keyword') keyword: string = '',
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
    limit: number = 10
  ) {
    const totalDocuments = await this.shareService.countGetUserShares(user._id.toString(), keyword);
    const shares = await this.shareService.getUserShares(user._id.toString(), page, limit, keyword);
    return new PaginateResponse(shares, {
      page,
      limit,
      totalDocuments
    }).setMessage('Lấy thông tin chia sẻ thành công');
  }
}
