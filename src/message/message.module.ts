import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SessionService } from 'src/session/session.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageService, SessionService],
  exports: [MessageService]
})
export class MessageModule {}
