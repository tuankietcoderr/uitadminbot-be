import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import mongoose, { Document, ObjectId, Types } from 'mongoose';
import { ENTITY_NAME } from '../constants';

export type CredentialDocument = Credential & Document<ObjectId>;

@Schema({ timestamps: true, collection: ENTITY_NAME.CREDENTIAL, autoCreate: true })
export class Credential {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true, index: true })
  user: string | User | Types.ObjectId;

  @Prop({ required: true })
  password: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
