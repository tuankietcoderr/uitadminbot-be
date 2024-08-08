import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [ChatRoomModule],
  controllers: [ShareController],
  providers: [ShareService]
})
export class ShareModule {}
