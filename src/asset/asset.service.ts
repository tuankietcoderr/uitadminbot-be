import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './asset.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asset, AssetDocument } from 'src/shared/entities';
import { Model } from 'mongoose';

@Injectable()
export class AssetService {
  constructor(@InjectModel(Asset.name) private readonly assetModel: Model<AssetDocument>) {}
  async create(data: CreateAssetDto) {
    return await this.assetModel.create(data);
  }

  async delete(public_id: string) {
    const asset = await this.assetModel.findOneAndDelete({ publicId: public_id });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async getAssetsByType(type: string, page: number = 1, limit: number = 10) {
    if (type === 'all') {
      return await this.assetModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
    }
    return await this.assetModel
      .find({ assetType: type })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async getAssetsCount(type: string) {
    if (type === 'all') {
      return await this.assetModel.countDocuments();
    }
    return await this.assetModel.countDocuments({ assetType: type });
  }
}
