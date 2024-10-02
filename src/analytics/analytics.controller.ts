import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { SuccessResponse } from 'src/shared/responses';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/shared/decorators';
import { ERole } from 'src/shared/enums';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles([ERole.ADMIN])
  @Get(':time')
  async createAnalytics(@Param('time') time: string) {
    return new SuccessResponse(await this.analyticsService.getAnalyticsByTime(time));
  }
}
