import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get(':type')
  async getAssetsByType(
    @Param('type') type: string,
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
    const totalDocuments = await this.assetService.getAssetsCount(type);
    return new PaginateResponse(await this.assetService.getAssetsByType(type, page, limit), {
      page,
      limit,
      totalDocuments
    }).setMessage('Assets fetched successfully');
  }
}
