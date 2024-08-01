import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';
import { Roles } from 'src/shared/decorators';
import { ERole } from 'src/shared/enums';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Roles([ERole.ADMIN])
  @Get()
  async getAssetsByType(
    @Query('type') type: string = 'pdf',
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
    const totalDocuments = await this.assetService.getAssetsCount(type, keyword);
    return new PaginateResponse(await this.assetService.getAssetsByTypePaginate(type, keyword, page, limit), {
      page,
      limit,
      totalDocuments
    }).setMessage('Assets fetched successfully');
  }
}
