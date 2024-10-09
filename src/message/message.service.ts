import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { readFile, readFileSync } from 'fs';
import { Model } from 'mongoose';
import { join, resolve } from 'path';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { SessionService } from 'src/session/session.service';
import { Message, MessageContent, MessageDocument } from 'src/shared/entities';
import { EContentType } from 'src/shared/enums';
import { IPaginationOptions } from 'src/shared/interfaces';
import { AIChatResponseDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async create(data: Partial<Message>) {
    const now = Date.now();
    const sessionTimeout = this.configService.get<number>('MESSAGE_SESSION_TIMEOUT');
    const lastMessage = await this.messageModel.findOne({ room: data.room }).sort({ createdAt: -1 });

    let sessionId;

    if (lastMessage) {
      sessionId = lastMessage.session;
      if (now - new Date(lastMessage.createdAt).getTime() <= sessionTimeout) {
        await this.sessionService.getModelInstance.findByIdAndUpdate(sessionId, {
          $set: { endTime: new Date(now) },
          $push: { messages: lastMessage._id }
        });
      } else {
        await this.sessionService.getModelInstance.findByIdAndUpdate(sessionId, {
          $set: { isExpired: true }
        });

        const newSession = await this.sessionService.create({
          messages: [lastMessage._id],
          startTime: new Date(now),
          endTime: new Date(now)
        });

        sessionId = newSession._id;
      }
    } else {
      const newSession = await this.sessionService.create({
        messages: [],
        startTime: new Date(now),
        endTime: new Date(now)
      });

      sessionId = newSession._id;
    }

    const startTime = Date.now();

    const res = await firstValueFrom(
      this.httpService
        .post<AIChatResponseDto>('/chat/chatDomain', {
          query: data.question.content,
          room_id: data.room
        })
        .pipe(
          catchError((err) => {
            console.log('AI SERVER ERROR: ', err);
            throw new BadRequestException('Lỗi khi gửi yêu cầu tới server AI');
          })
        )
    );

    const endTime = Date.now();
    const timeDelta = endTime - startTime;
    const responseTime = timeDelta - Math.min(timeDelta / 5, this.configService.get<number>('CHEAT_RESPONSE_TIME'));

    const message = new this.messageModel({ ...data, session: sessionId });

    //* FETCH ANSWER FROM AI SERVER
    const answer: MessageContent = {
      content: res.data.response,
      contentType: EContentType.TEXT
    };

    message.answer = answer;
    message.isOutDomain = res.data.is_outdomain;
    message.responseTime = responseTime;
    const newMessage = await message.save();
    return newMessage;
  }

  async getRoomMessages(roomId: string) {
    return await this.messageModel.find({ room: roomId });
  }

  async countRoomMessages(roomId: string) {
    return await this.messageModel.countDocuments({ room: roomId });
  }

  async deleteRoomMessages(roomId: string) {
    await this.messageModel.deleteMany({ room: roomId });
  }

  async likeMessage(messageId: string) {
    const message = await this.findByIdOrThrow(messageId);
    const isMessageLiked = message.isLiked;
    message.isDisliked = false;
    message.isLiked = !isMessageLiked;

    await message.save();

    return message;
  }

  async dislikeMessage(messageId: string) {
    const message = await this.findByIdOrThrow(messageId);
    const isMessageDisliked = message.isDisliked;
    message.isLiked = false;
    message.isDisliked = !isMessageDisliked;

    await message.save();

    return message;
  }

  async findAll() {
    return await this.messageModel.find();
  }

  async findById(messageId: string) {
    return await this.messageModel.findById(messageId);
  }

  async findByIdOrThrow(messageId: string) {
    const message = await this.findById(messageId);
    if (!message) {
      throw new NotFoundException('Không tìm thấy tin nhắn');
    }
    return message;
  }
}
