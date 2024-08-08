import { IsNotEmpty } from 'class-validator';

export class CreateFileTraningDto {
  @IsNotEmpty()
  public_id: string;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  file_type: string;
  @IsNotEmpty()
  file_name: string;
}
