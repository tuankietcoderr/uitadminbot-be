import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AssetService } from 'src/asset/asset.service';
import { FileTrainingService } from 'src/file-training/file-training.service';

@Module({
  providers: [UploadService, CloudinaryService, AssetService, FileTrainingService],
  controllers: [UploadController]
})
export class UploadModule {}
