import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('AI_HOST'),
        timeout: configService.get<number>('HTTP_TIMEOUT'),
        withCredentials: true
      }),
      inject: [ConfigService]
    })
  ],
  exports: [HttpModule]
})
export class GlobalHttpModule {}
