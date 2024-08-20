import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { Message, MessageDocument, Share, ShareDocument } from 'src/shared/entities';
import { IDataFilter } from 'src/shared/interfaces';

@Injectable()
export class ShareService {
  constructor(
    @InjectModel(Share.name) private readonly shareModel: Model<ShareDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly roomService: ChatRoomService
  ) {}

  async create(owner: string) {
    const room = await this.roomService.getUserChatRoom(owner);
    const messages = await this.roomService.getRoomMessages(room._id.toString());
    const messageIds = messages.map((message) => message._id.toString());
    return await this.shareModel.create({
      messages: messageIds,
      owner,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  }

  async getShareById(_id: string) {
    return await this.shareModel.findById(
      _id,
      {},
      {
        populate: {
          path: 'messages'
        }
      }
    );
  }

  async getShareByIdOrThrow(_id: string) {
    const share = await this.getShareById(_id);

    if (!share) {
      throw new NotFoundException('Không tìm thấy link chia sẻ');
    }

    const expiredAt = new Date(share.expiredAt);

    if (expiredAt < new Date()) {
      share.isExpired = true;
      await share.save();
    }

    return share;
  }

  async cancelShare(_id: string) {
    const share = await this.getShareByIdOrThrow(_id);
    share.isShared = !share.isShared;
    await share.save();
    return share;
  }

  async countGetUserShares(owner: string, keyword: string = '') {
    return await this.shareModel.countDocuments({ owner }).exec();
  }

  async getUserShares(owner: string, { keyword = '', page = 1, limit = 10 }: IDataFilter) {
    return await this.shareModel
      .find({ owner })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
}
