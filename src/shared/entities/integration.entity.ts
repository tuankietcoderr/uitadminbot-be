import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import mongoose, { Document, ObjectId, Types } from 'mongoose';
import { ENTITY_NAME } from '../constants';

export type IntegrationDocument = Integration & Document<ObjectId>;

@Schema({ timestamps: true, collection: ENTITY_NAME.INTEGRATION, autoCreate: true })
export class Integration {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true, index: true })
  creator: string | User | Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  isBanned: boolean;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
