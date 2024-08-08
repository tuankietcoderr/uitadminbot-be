import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('AI_HOST'),
        timeout: 60000,
        withCredentials: true
      }),
      inject: [ConfigService]
    })
  ],
  exports: [HttpModule]
})
export class GlobalHttpModule {}
