import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENTITY_NAME } from '../constants';
import { Document, ObjectId, Schema as MongooseSchema, Types } from 'mongoose';
import { ChatUser } from './user.entity';

export type ChatRoomDocument = ChatRoom & Document<ObjectId>;

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.CHAT_ROOM })
export class ChatRoom {
  _id: Types.ObjectId;
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: true, type: MongooseSchema.Types.ObjectId, ref: ENTITY_NAME.USER })
  creator: string | Types.ObjectId | ChatUser;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
