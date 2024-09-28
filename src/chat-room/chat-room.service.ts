import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { MessageService } from 'src/message/message.service';
import { ChatRoom, ChatRoomDocument } from 'src/shared/entities';
import { IPaginationOptions } from 'src/shared/interfaces';

@Injectable()
export class ChatRoomService {
  private readonly ROOM_USER_CACHE_KEY = 'chat-rooms-user';

  constructor(
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoomDocument>,
    private readonly messageService: MessageService,
    private readonly httpService: HttpService
  ) {}

  async create(data: Partial<ChatRoom>) {
    const chatRoom = await this.chatRoomModel.create(data);
    return chatRoom;
  }

  async getRoomMessages(roomId: string) {
    await this.findByIdOrThrow(roomId);
    return await this.messageService.getRoomMessages(roomId);
  }

  async countRoomMessages(roomId: string) {
    await this.findByIdOrThrow(roomId);
    return await this.messageService.countRoomMessages(roomId);
  }

  async getUserChatRooms(userId: string | Types.ObjectId) {
    return await this.chatRoomModel.find({ creator: userId }).select('-creator');
  }
  async getUserChatRoom(userId: string) {
    const lastRoom = await this.chatRoomModel
      .findOne({ creator: userId })
      .select('-creator')
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastRoom) {
      return await this.create({ creator: userId, title: 'Phòng chat mới' });
    }

    return lastRoom;
  }

  async updateTitle(_id: string, title: string) {
    const chatRoom = await this.chatRoomModel.findByIdAndUpdate(_id, { $set: { title } }, { new: true });

    if (!chatRoom) {
      throw new NotFoundException('Phòng chat không tồn tại');
    }

    return chatRoom;
  }

  async findOne(query: Partial<ChatRoom>) {
    const chatRoom = await this.chatRoomModel.findOne(query);
    return chatRoom;
  }

  async findById(id: string) {
    const chatRoom = await this.chatRoomModel.findById(id);
    return chatRoom;
  }

  async countDocuments(query: Partial<ChatRoom>) {
    return await this.chatRoomModel.countDocuments(query).exec();
  }

  async findOneOrThrow(query: Partial<ChatRoom>) {
    const chatRoom = await this.findOne(query);
    if (!chatRoom) {
      throw new NotFoundException('Phòng chat không tồn tại');
    }
    return chatRoom;
  }

  async findByIdOrThrow(id: string) {
    const chatRoom = await this.findById(id);
    if (!chatRoom) {
      throw new NotFoundException('Phòng chat không tồn tại');
    }
    return chatRoom;
  }

  async deleteRoom(userId: string) {
    const chatRoom = await this.getUserChatRoom(userId);

    await firstValueFrom(
      this.httpService.delete('/chat/deleteChat', {
        params: { room_id: chatRoom.id }
      })
    ).catch(console.log);

    await this.messageService.deleteRoomMessages(chatRoom._id.toString());

    await chatRoom.deleteOne();

    return chatRoom;
  }
}
