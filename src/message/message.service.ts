import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionService } from 'src/session/session.service';
import { Message, MessageContent, MessageDocument } from 'src/shared/entities';
import { EContentType } from 'src/shared/enums';
import { IPaginationOptions } from 'src/shared/interfaces';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService
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
          messages: [],
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

    const message = new this.messageModel({ ...data, session: sessionId });

    //* FETCH ANSWER FROM AI SERVER
    const answer: MessageContent = {
      content: 'This is an answer from the AI server',
      contentType: EContentType.IMAGE,
      extra: {
        images: [
          'https://yt3.googleusercontent.com/WoDkWmAjQ5Dbw-ccjqFku8ThK2UYcqaOqq25PBE9eGb_S-vsqxiKU2kL2kZJVz_BcAMv3WUWsA=s900-c-k-c0x00ffffff-no-rj'
        ]
      }
    };

    message.answer = answer;
    const newMessage = await message.save();
    return newMessage;
  }

  async getRoomMessages(roomId: string, { page = 1, limit = 10 }: IPaginationOptions) {
    return await this.messageModel
      .find({ room: roomId })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async countRoomMessages(roomId: string) {
    return await this.messageModel.countDocuments({ room: roomId });
  }

  async deleteRoomMessages(roomId: string) {
    await this.messageModel.deleteMany({ room: roomId });
  }

  async likeMessage(messageId: string) {
    const message = await this.messageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          isLiked: true,
          isDisliked: false
        }
      },
      {
        new: true
      }
    );

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async dislikeMessage(messageId: string) {
    const message = await this.messageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          isLiked: false,
          isDisliked: true
        }
      },
      { new: true }
    );

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
