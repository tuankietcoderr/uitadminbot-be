import { IsNotEmpty } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  title: string;
}
