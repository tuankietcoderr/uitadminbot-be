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
  Integration,
  IntegrationSchema,
  Message,
  MessageSchema,
  Session,
  SessionSchema,
  Share,
  ShareSchema,
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
  { name: Session.name, schema: SessionSchema },
  { name: Message.name, schema: MessageSchema },
  { name: Analytics.name, schema: AnalyticsSchema },
  { name: Asset.name, schema: AssetSchema },
  { name: Share.name, schema: ShareSchema },
  { name: Integration.name, schema: IntegrationSchema }
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule]
})
export class MongooseModelsModule {}
