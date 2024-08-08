import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mime from 'mime-types';
import { AssetService } from 'src/asset/asset.service';
import { FileTrainingService } from 'src/file-training/file-training.service';
import { CurrentUser, Roles } from 'src/shared/decorators';
import { User } from 'src/shared/entities';
import { ERole } from 'src/shared/enums';
import { ErrorResponse, SuccessResponse } from 'src/shared/responses';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly assetService: AssetService,
    private readonly fileTrainingService: FileTrainingService
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

  @Roles([ERole.ADMIN])
  @Post('link')
  async uploadLink(
    @Body()
    data: {
      link: string;
    },
    @CurrentUser() user: User
  ) {
    const { link } = data;
    const asset = await this.assetService.createLink({
      link,
      uploader: user._id.toString(),
      isAdminUpload: user.role === ERole.ADMIN
    });

    await this.fileTrainingService
      .trainFile([
        {
          file_name: asset.originalFilename,
          public_id: asset.publicId,
          url: asset.url,
          file_type: 'link'
        }
      ])
      .catch(async (error) => {
        await this.assetService.delete(asset.publicId);
        return new ErrorResponse(error.message).setStatusCode(HttpStatus.BAD_REQUEST);
      });

    return new SuccessResponse(asset).setMessage('Tải lên liên kết thành công').setStatusCode(HttpStatus.CREATED);
  }

  @Roles([ERole.ADMIN])
  @Post('train')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrain(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
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

    const pdfFormat = ['pdf'];
    const excelFormat = ['xls', 'xlsx', 'csv'];
    const imageFormat = ['png', 'jpg', 'jpeg'];

    const fileType = pdfFormat.includes(asset.format) ? 'pdf' : excelFormat.includes(asset.format) ? 'excel' : 'image';

    await this.fileTrainingService
      .trainFile([
        {
          file_name: res.original_filename,
          public_id: res.public_id,
          url: res.secure_url,
          file_type: fileType
        }
      ])
      .catch(async (error) => {
        await this.assetService.delete(res.public_id);
        return new ErrorResponse(error.message).setStatusCode(HttpStatus.BAD_REQUEST);
      });

    return new SuccessResponse(asset).setMessage('Tải lên tệp tin thành công').setStatusCode(HttpStatus.CREATED);
  }

  @Roles([ERole.ADMIN])
  @Delete('/train')
  async deleteTrain(@Query('public_id') public_id: string) {
    const asset = await this.assetService.getAssetByPublicIdOrThrow(public_id);

    return await this.uploadService.deleteResource(public_id, asset.assetType).then(async (res) => {
      if (res.result === 'ok') {
        const asset = await this.assetService.delete(public_id);
        await this.fileTrainingService.deleteFile(public_id).catch(async (error) => {
          console.log(error.message);
        });
        return new SuccessResponse(asset).setStatusCode(HttpStatus.NO_CONTENT);
      }

      return new ErrorResponse('Lỗi xảy ra khi xóa tệp tin').setStatusCode(HttpStatus.BAD_REQUEST);
    });
  }

  @Roles([ERole.ADMIN])
  @Delete('/link')
  async deleteLink(@Query('public_id') public_id: string) {
    return await this.assetService.delete(public_id).then(async (res) => {
      await this.fileTrainingService.deleteFile(public_id).catch(async (error) => {
        console.log(error.message);
      });
      return new SuccessResponse(res).setStatusCode(HttpStatus.NO_CONTENT);
    });
  }

  @Delete()
  async deleteResource(@Query('public_id') public_id: string) {
    const asset = await this.assetService.getAssetByPublicIdOrThrow(public_id);

    return await this.uploadService
      .deleteResource(public_id, asset.assetType)
      .then(async (res) => {
        if (res.result === 'ok') {
          const asset = await this.assetService.delete(public_id);
          return new SuccessResponse(asset).setStatusCode(HttpStatus.NO_CONTENT);
        }

        return new ErrorResponse('Lỗi xảy ra khi xóa tệp tin').setStatusCode(HttpStatus.BAD_REQUEST);
      })
      .catch((error) => {
        return new ErrorResponse(error.message).setStatusCode(HttpStatus.BAD_REQUEST);
      });
  }
}
