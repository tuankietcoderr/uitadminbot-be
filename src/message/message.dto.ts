import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { MessageContent } from 'src/shared/entities';
import { EContentType } from 'src/shared/enums';

class MessageContentValidator {
  @IsNotEmpty()
  content: string;
  contentType: EContentType;
  extra?: Record<string, any>;
}

export class CreateMessageDto {
  @ValidateNested()
  @IsNotEmptyObject()
  question: MessageContentValidator;

  @IsString()
  @IsNotEmpty()
  room: string;
}
