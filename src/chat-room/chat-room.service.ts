import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageService } from 'src/message/message.service';
import { ChatRoom, ChatRoomDocument } from 'src/shared/entities';
import { IPaginationOptions } from 'src/shared/interfaces';

@Injectable()
export class ChatRoomService {
  private readonly ROOM_USER_CACHE_KEY = 'chat-rooms-user';

  constructor(
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoomDocument>,
    private readonly messageService: MessageService
  ) {}

  async create(data: Partial<ChatRoom>) {
    const chatRoom = await this.chatRoomModel.create(data);
    return chatRoom;
  }

  async getRoomMessages(roomId: string, { page = 1, limit = 10 }: IPaginationOptions) {
    await this.findByIdOrThrow(roomId);
    return await this.messageService.getRoomMessages(roomId, { page, limit });
  }

  async countRoomMessages(roomId: string) {
    await this.findByIdOrThrow(roomId);
    return await this.messageService.countRoomMessages(roomId);
  }

  async getUserChatRooms(userId: string | Types.ObjectId) {
    return await this.chatRoomModel.find({ creator: userId }).select('-creator').exec();
  }

  async updateTitle(_id: string, title: string) {
    const chatRoom = await this.chatRoomModel.findByIdAndUpdate(_id, { $set: { title } }, { new: true });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
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
      throw new NotFoundException('Chat room not found');
    }
    return chatRoom;
  }

  async findByIdOrThrow(id: string) {
    const chatRoom = await this.findById(id);
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }
    return chatRoom;
  }

  async deleteRoom(_id: string) {
    const chatRoom = await this.findByIdOrThrow(_id);

    await this.messageService.deleteRoomMessages(_id);

    await chatRoom.deleteOne();

    return chatRoom;
  }
}
