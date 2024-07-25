import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import * as multer from 'multer';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GlobalConfigModule } from './config/config.module';
import { DatabaseModule } from './config/database.module';
import { MongooseModelsModule } from './config/mongoose.module';
import { MessageModule } from './message/message.module';
import { SessionModule } from './session/session.module';
import { UploadModule } from './upload/upload.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage()
    }),
    GlobalConfigModule,
    ScheduleModule.forRoot(),
    AuthModule,
    DatabaseModule,
    MongooseModelsModule,
    MessageModule,
    ChatRoomModule,
    SessionModule,
    AnalyticsModule,
    CloudinaryModule,
    UploadModule,
    AssetModule,
    LoggerModule
  ],
  controllers: [AppController]
})
export class AppModule {}
