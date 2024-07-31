import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get('NODE_ENV') === 'development'
            ? configService.get('MONGO_URI_LOCAL')
            : configService.get('MONGO_URI')
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
