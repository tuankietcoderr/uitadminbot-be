import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { SuccessResponse } from 'src/shared/responses';
import { CreateMessageDto } from './message.dto';
import { Public } from 'src/shared/decorators';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Get()
  async getMessages() {
    return new SuccessResponse(await this.messageService.findAll());
  }

  @Post()
  async createMessage(@Body() data: CreateMessageDto) {
    return new SuccessResponse(await this.messageService.create(data)).setMessage('Đã gửi tin nhắn');
  }

  @Put(':messageId/like')
  async likeMessage(@Param('messageId') messageId: string) {
    return new SuccessResponse(await this.messageService.likeMessage(messageId));
  }

  @Put(':messageId/dislike')
  async dislikeMessage(@Param('messageId') messageId: string) {
    return new SuccessResponse(await this.messageService.dislikeMessage(messageId));
  }
}
