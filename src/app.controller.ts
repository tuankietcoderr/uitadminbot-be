import { Controller, Get, Query, Req, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from './shared/decorators';
import { Request, Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Public()
  @Get('environment')
  changePostmanEnvironment(@Query('env') env: string) {
    return env === 'production' ? 'prod' : 'dev';
  }
}
