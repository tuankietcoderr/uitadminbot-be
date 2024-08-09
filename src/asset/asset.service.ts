import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto, CreateLinkDto } from './asset.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asset, AssetDocument, User } from 'src/shared/entities';
import { Model } from 'mongoose';
import { IDataFilter } from 'src/shared/interfaces';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name) private readonly assetModel: Model<AssetDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}
  async create(data: CreateAssetDto) {
    return await this.assetModel.create(data);
  }

  async createLink(data: CreateLinkDto) {
    const { link } = data;
    // extract name from link and remove query string and hash
    const name = link.split('/').pop();
    return await this.assetModel.create({
      ...data,
      url: link,
      assetType: 'link',
      originalFilename: name,
      format: 'link',
      publicId: `link-${name}`,
      size: 0
    });
  }

  async delete(public_id: string) {
    const asset = await this.assetModel.findOneAndDelete({ publicId: public_id });
    if (!asset) {
      throw new NotFoundException('Không tìm thấy tệp tin');
    }

    return asset;
  }

  public async getAssetByPublicId(public_id: string) {
    return await this.assetModel.findOne({ publicId: public_id });
  }

  public async getAssetByPublicIdOrThrow(public_id: string) {
    const asset = await this.getAssetByPublicId(public_id);
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

  async getAssetsByTypePaginate(type: string, { keyword, limit = 10, page = 1 }: IDataFilter) {
    return await this.getAssetByType(type, keyword)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAssetsCount(type: string, keyword: string) {
    return await this.getAssetByType(type, keyword).countDocuments();
  }
}
