import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto } from './integration.dto';
import { CurrentUser, Roles } from 'src/shared/decorators';
import { User } from 'src/shared/entities';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';
import { ERole } from 'src/shared/enums';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Roles([ERole.ADMIN])
  @Post()
  async createIntegration(@Body() data: CreateIntegrationDto, @CurrentUser() user: User) {
    return new SuccessResponse(
      await this.integrationService.create({
        ...data,
        creator: user._id
      })
    )
      .setMessage('Tạo tích hợp thành công')
      .setStatusCode(HttpStatus.CREATED);
  }

  @Roles([ERole.ADMIN])
  @Get()
  async getIntegrations(
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
    const totalDocuments = await this.integrationService.countIntegrations();
    return new PaginateResponse(
      await this.integrationService.findIntegrations({
        page,
        limit,
        keyword
      }),
      {
        page,
        limit,
        totalDocuments
      }
    ).setMessage('Danh sách tích hợp');
  }

  @Roles([ERole.ADMIN])
  @Put(':integrationId')
  async banIntegration(@Param('integrationId') integrationId: string) {
    return new SuccessResponse(await this.integrationService.banIntegration(integrationId)).setMessage(
      'Cập nhật trạng thái tích hợp thành công'
    );
  }

  @Roles([ERole.ADMIN])
  @Delete(':integrationId')
  async deleteIntegration(@Param('integrationId') integrationId: string) {
    return new SuccessResponse(await this.integrationService.deleteIntegration(integrationId)).setMessage(
      'Xóa tích hợp thành công'
    );
  }
}
