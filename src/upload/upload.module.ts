import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AssetService } from 'src/asset/asset.service';

@Module({
  providers: [UploadService, CloudinaryService, AssetService],
  controllers: [UploadController]
})
export class UploadModule {}
