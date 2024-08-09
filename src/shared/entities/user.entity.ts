import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENTITY_NAME } from '../constants';
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';
import { EAuthStrategy, ERole } from '../enums';

export type UserDocument = User & Document<ObjectId>;
export type AdminDocument = Admin & Document<ObjectId>;
export type ChatUserDocument = ChatUser & Document<ObjectId>;

@Schema({ timestamps: true, collection: ENTITY_NAME.USER, autoCreate: true, discriminatorKey: 'userKind' })
export class User {
  _id: Types.ObjectId;

  @Prop({ default: ERole.CHAT_USER, enum: Object.values(ERole) })
  role: string;

  @Prop({
    enum: Object.values(EAuthStrategy),
    default: EAuthStrategy.GUEST
  })
  authStrategy: EAuthStrategy;
}

@Schema({ timestamps: true, collection: ENTITY_NAME.ADMIN, autoCreate: true })
export class Admin extends User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({ default: false })
  isBanned?: boolean;
}

@Schema({ timestamps: true, collection: ENTITY_NAME.CHAT_USER, autoCreate: true })
export class ChatUser extends User {}

const AdminSchema = SchemaFactory.createForClass(Admin);
const ChatUserSchema = SchemaFactory.createForClass(ChatUser);
const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema, AdminSchema, ChatUserSchema };
