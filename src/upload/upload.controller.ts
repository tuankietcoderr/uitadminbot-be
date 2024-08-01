import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorResponse, SuccessResponse } from 'src/shared/responses';
import { AssetService } from 'src/asset/asset.service';
import { CurrentUser } from 'src/shared/decorators';
import { User } from 'src/shared/entities';
import * as mime from 'mime-types';
import { ERole } from 'src/shared/enums';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly assetService: AssetService
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    const res = await this.uploadService.uploadFile(file);

    const asset = await this.assetService.create({
      publicId: res.public_id,
      url: res.secure_url,
      format: res.format ?? mime.extension(file.mimetype),
      originalFilename: res.original_filename,
      size: res.bytes,
      uploader: user._id.toString(),
      assetType: res.resource_type,
      isAdminUpload: user.role === ERole.ADMIN
    });

    return new SuccessResponse(asset).setMessage('Tải lên tệp tin thành công').setStatusCode(HttpStatus.CREATED);
  }

  @Delete()
  async deleteResource(@Query('public_id') public_id: string) {
    return await this.uploadService
      .deleteResource(public_id)
      .then(async (res) => {
        if (res.result === 'ok') {
          const asset = await this.assetService.delete(public_id);
          return new SuccessResponse(asset).setStatusCode(HttpStatus.NO_CONTENT);
        }

        throw new BadRequestException(`Lỗi xảy ra khi xóa tệp tin ${JSON.stringify(res)}`);
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
