import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { ENTITY_NAME } from '../constants';
import { Admin, ChatUser } from './user.entity';

export type AssetDocument = Asset & Document<Types.ObjectId>;

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.ASSET })
export class Asset {
  _id: string;

  @Prop({ required: true, index: true, unique: true })
  publicId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  assetType: string;

  @Prop({ required: true })
  format: string;

  @Prop()
  size: number;

  @Prop({ required: true })
  originalFilename: string;

  @Prop({ required: true, index: true, type: MongooseSchema.Types.ObjectId, ref: ENTITY_NAME.USER })
  uploader: string | Types.ObjectId | Admin | ChatUser;

  @Prop({ default: false })
  isAdminUpload: boolean;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
