import { IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  publicId: string;
  @IsNotEmpty()
  format: string;
  @IsNotEmpty()
  size: number;
  @IsNotEmpty()
  originalFilename: string;
  @IsNotEmpty()
  uploader: string;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  assetType: string;
}
