import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
