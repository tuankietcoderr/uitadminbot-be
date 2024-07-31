import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Credential, CredentialDocument } from 'src/shared/entities';

@Injectable()
export class CredentialService {
  constructor(@InjectModel(Credential.name) private readonly credentialModel: Model<CredentialDocument>) {}

  async findByUserId(userId: string | Types.ObjectId) {
    const credential = await this.credentialModel.findOne({ user: userId });

    if (!credential) {
      throw new NotFoundException(`Không tìm thấy thông tin đăng nhập của người dùng`);
    }

    return credential;
  }

  async create(data: Partial<Credential>) {
    const credential = await this.credentialModel.create(data);

    return credential;
  }
}
