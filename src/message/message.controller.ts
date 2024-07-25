import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { SuccessResponse } from 'src/shared/responses';
import { CreateMessageDto } from './message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() data: CreateMessageDto) {
    return new SuccessResponse(await this.messageService.create(data)).setMessage('Message created successfully');
  }

  @Put(':messageId/like')
  async likeMessage(@Param('messageId') messageId: string) {
    return new SuccessResponse(await this.messageService.likeMessage(messageId)).setMessage(
      'Message liked successfully'
    );
  }

  @Put(':messageId/dislike')
  async dislikeMessage(@Param('messageId') messageId: string) {
    return new SuccessResponse(await this.messageService.dislikeMessage(messageId)).setMessage(
      'Message disliked successfully'
    );
  }
}
