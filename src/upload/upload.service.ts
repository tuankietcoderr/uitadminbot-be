import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File) {
    return await this.cloudinaryService.upload(file).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async deleteResource(public_id: string) {
    return await this.cloudinaryService.deleteResource(public_id).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }
}
