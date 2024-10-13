import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { ChatRoom, User } from 'src/shared/entities';
import { ChatRoomService } from './chat-room.service';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';
import { CreateChatRoomDto } from './chat-room.dto';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/chat-user')
  async getChatRoom(@CurrentUser() user: User) {
    return new SuccessResponse(await this.chatRoomService.getUserChatRoom(user._id.toString())).setMessage(
      'Các phòng chat đã được tải'
    );
  }

  @Post()
  async createChatRoom(@CurrentUser() user: User, @Body() data: CreateChatRoomDto) {
    const chatRoom = await this.chatRoomService.create({
      creator: user._id,
      ...data
    });
    return new SuccessResponse(chatRoom).setMessage('Phòng chat được tạo thành công').setStatusCode(HttpStatus.CREATED);
  }

  @Put(':roomId')
  async updateRoomTitle(@Param('roomId') roomId: string, @Body('title') title: string) {
    return new SuccessResponse(await this.chatRoomService.updateTitle(roomId, title)).setMessage(
      'Thay đổi tiêu đề phòng chat thành công'
    );
  }

  @Get(':roomId')
  async getRoomMessages(@Param('roomId') roomId: string) {
    const totalDocuments = await this.chatRoomService.countRoomMessages(roomId);
    return new SuccessResponse(await this.chatRoomService.getRoomMessages(roomId)).setMessage('Danh sách tin nhắn');
  }

  @Delete()
  async deleteRoom(@CurrentUser() user: User) {
    return new SuccessResponse(await this.chatRoomService.deleteRoom(user._id.toString())).setStatusCode(HttpStatus.OK);
  }
}
