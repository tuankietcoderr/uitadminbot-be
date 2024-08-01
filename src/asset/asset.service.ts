import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './asset.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asset, AssetDocument, User } from 'src/shared/entities';
import { Model } from 'mongoose';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name) private readonly assetModel: Model<AssetDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}
  async create(data: CreateAssetDto) {
    return await this.assetModel.create(data);
  }

  async delete(public_id: string) {
    const asset = await this.assetModel.findOneAndDelete({ publicId: public_id });
    if (!asset) {
      throw new NotFoundException('Không tìm thấy tệp tin');
    }

    return asset;
  }

  private getAssetByType(type: string, keyword: string) {
    const pdfFormat = ['pdf'];
    const excelFormat = ['xls', 'xlsx', 'csv'];
    const imageFormat = ['png', 'jpg', 'jpeg'];
    return this.assetModel.find(
      {
        originalFilename: { $regex: keyword, $options: 'i' },
        isAdminUpload: true,
        format:
          type === 'pdf'
            ? { $in: pdfFormat }
            : type === 'excel'
              ? { $in: excelFormat }
              : type === 'image'
                ? { $in: imageFormat }
                : { $nin: [...pdfFormat, ...excelFormat, ...imageFormat] }
      },
      {},
      {
        populate: {
          path: 'uploader',
          model: this.userModel,
          select: 'name'
        }
      }
    );
  }

  async getAssetsByTypePaginate(type: string, keyword: string, page: number = 1, limit: number = 10) {
    return await this.getAssetByType(type, keyword)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAssetsCount(type: string, keyword: string) {
    return await this.getAssetByType(type, keyword).countDocuments();
  }
}
