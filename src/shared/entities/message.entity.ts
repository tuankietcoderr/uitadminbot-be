import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENTITY_NAME } from '../constants';
import { Document, ObjectId, Schema as MongooseSchema, Types } from 'mongoose';
import { EContentType } from '../enums';
import { ChatRoom } from './room.entity';
import { Session } from './session.entity';

export type MessageDocument = Message & Document<ObjectId>;

export class MessageContent {
  content: string;
  contentType: EContentType;
  extra?: Record<string, any>; // images: []
}

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.CHAT_MESSAGE })
export class Message {
  _id: Types.ObjectId;

  @Prop({ type: MessageContent, default: null })
  question: MessageContent | null;

  @Prop({ type: MessageContent, default: null })
  answer: MessageContent | null;

  @Prop({ required: true, index: true, type: MongooseSchema.Types.ObjectId, ref: ENTITY_NAME.CHAT_ROOM })
  room: string | Types.ObjectId | ChatRoom;

  @Prop({ default: false })
  isLiked: boolean;

  @Prop({ default: false })
  isDisliked: boolean;

  @Prop({ default: false })
  isOutDomain: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ENTITY_NAME.SESSION })
  session: string | Types.ObjectId | Session;

  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
