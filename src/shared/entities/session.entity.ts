import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENTITY_NAME } from '../constants';
import { Types, Schema as MongooseSchema, ObjectId, Document } from 'mongoose';
import { ChatUser, User } from './user.entity';
import { Message } from './message.entity';

export type SessionDocument = Session & Document<ObjectId>;

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.SESSION })
export class Session {
  _id: Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  startTime: Date;

  @Prop({ required: true, default: new Date() })
  endTime: Date;

  @Prop({ required: true, default: false })
  isExpired: boolean;

  @Prop({
    required: true,
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: ENTITY_NAME.CHAT_MESSAGE
      }
    ]
  })
  messages: string[] | Types.ObjectId[] | Message[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);
