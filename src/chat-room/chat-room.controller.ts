import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { ChatRoom, User } from 'src/shared/entities';
import { ChatRoomService } from './chat-room.service';
import { PaginateResponse, SuccessResponse } from 'src/shared/responses';
import { CreateChatRoomDto } from './chat-room.dto';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/user')
  async getChatRoom(@CurrentUser() user: User) {
    return new SuccessResponse(await this.chatRoomService.getUserChatRooms(user._id)).setMessage(
      'Chat rooms fetched successfully'
    );
  }

  @Post()
  async createChatRoom(@CurrentUser() user: User, @Body() data: CreateChatRoomDto) {
    const chatRoom = await this.chatRoomService.create({
      creator: user._id,
      ...data
    });
    return new SuccessResponse(chatRoom).setMessage('Chat room created successfully').setStatusCode(HttpStatus.CREATED);
  }

  @Put(':roomId')
  async updateRoomTitle(@Param('roomId') roomId: string, @Body('title') title: string) {
    return new SuccessResponse(await this.chatRoomService.updateTitle(roomId, title)).setMessage(
      'Chat room updated successfully'
    );
  }

  @Get(':roomId')
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @Query(
      'page',
      new ParseIntPipe({
        optional: true
      })
    )
    page: number = 1,
    @Query(
      'limit',
      new ParseIntPipe({
        optional: true
      })
    )
    limit: number = 10
  ) {
    const totalDocuments = await this.chatRoomService.countRoomMessages(roomId);
    return new PaginateResponse(await this.chatRoomService.getRoomMessages(roomId, { page, limit }), {
      limit,
      page,
      totalDocuments
    }).setMessage('Chat room fetched successfully');
  }

  @Delete(':roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    return new SuccessResponse(await this.chatRoomService.deleteRoom(roomId)).setStatusCode(HttpStatus.NO_CONTENT);
  }
}
