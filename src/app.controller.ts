import { Controller, Get, Query } from '@nestjs/common';
import { Public } from './shared/decorators';

@Controller()
export class AppController {
  @Public()
  @Get()
  changePostmanEnvironment(@Query('env') env: string) {
    return env === 'production' ? 'prod' : 'dev';
  }
}
