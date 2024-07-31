import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from 'src/shared/entities';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>) {}

  async create(data: Partial<Session>) {
    return await this.sessionModel.create(data);
  }

  async findById(sessionId: string) {
    return await this.sessionModel.findById(sessionId);
  }

  async findByIdOrThrow(sessionId: string) {
    const session = await this.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên làm việc');
    }
    return session;
  }

  async update(sessionId: string, data: Partial<Session>) {
    const session = await this.sessionModel.findByIdAndUpdate(sessionId, { $set: data }, { new: true });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên làm việc');
    }
    return session;
  }

  get getModelInstance() {
    return this.sessionModel;
  }
}
