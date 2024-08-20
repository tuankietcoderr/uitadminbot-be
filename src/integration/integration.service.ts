import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Integration, IntegrationDocument } from 'src/shared/entities';
import { IDataFilter } from 'src/shared/interfaces';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<IntegrationDocument>
  ) {}

  async create(data: Partial<Integration>) {
    const integration = await this.integrationModel.create(data);
    return integration;
  }

  async countIntegrations(keyword: string = '') {
    return await this.integrationModel
      .countDocuments({
        $or: [{ name: { $regex: keyword, $options: 'i' } }, { url: { $regex: keyword, $options: 'i' } }]
      })
      .exec();
  }

  async findIntegrations(filter: IDataFilter) {
    const { keyword = '', limit = 10, page = 1 } = filter;
    return await this.integrationModel
      .find({
        $or: [{ name: { $regex: keyword, $options: 'i' } }, { url: { $regex: keyword, $options: 'i' } }]
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async banIntegration(_id: string) {
    const integration = await this.integrationModel.findById(_id);

    if (!integration) {
      throw new NotFoundException('Không tìm thấy Integration');
    }

    integration.isBanned = !integration.isBanned;
    await integration.save();

    return integration;
  }

  async deleteIntegration(_id: string) {
    const integration = await this.integrationModel.findByIdAndDelete(_id);

    if (!integration) {
      throw new NotFoundException('Không tìm thấy Integration');
    }

    return integration;
  }
}
