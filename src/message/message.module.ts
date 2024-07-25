import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SessionService } from 'src/session/session.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, SessionService],
  exports: [MessageService]
})
export class MessageModule {}
