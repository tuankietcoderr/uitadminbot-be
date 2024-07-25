import { Global, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminSchema,
  Analytics,
  AnalyticsSchema,
  Asset,
  AssetSchema,
  ChatRoom,
  ChatRoomSchema,
  ChatUser,
  ChatUserSchema,
  Credential,
  CredentialSchema,
  Message,
  MessageSchema,
  Session,
  SessionSchema,
  User,
  UserSchema
} from 'src/shared/entities';

const MODELS: ModelDefinition[] = [
  {
    name: User.name,
    schema: UserSchema,
    discriminators: [
      { name: Admin.name, schema: AdminSchema },
      { name: ChatUser.name, schema: ChatUserSchema }
    ]
  },
  { name: Credential.name, schema: CredentialSchema },
  { name: ChatRoom.name, schema: ChatRoomSchema },
  { name: Message.name, schema: MessageSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Analytics.name, schema: AnalyticsSchema },
  { name: Asset.name, schema: AssetSchema }
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule]
})
export class MongooseModelsModule {}
