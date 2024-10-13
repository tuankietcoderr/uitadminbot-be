import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';
import { ENTITY_NAME } from '../constants';
import { Message } from './message.entity';
import { User } from './user.entity';

export type ShareDocument = Share & Document<ObjectId>;

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.SHARE })
export class Share {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  owner: string | Types.ObjectId | User;

  @Prop({ default: new Date() })
  expiredAt: Date;

  @Prop({ default: false })
  isExpired: boolean;

  @Prop({ default: true })
  isShared: boolean;

  @Prop({
    required: true,
    type: [Message],
    default: []
  })
  messages: Message[];
}

export const ShareSchema = SchemaFactory.createForClass(Share);
