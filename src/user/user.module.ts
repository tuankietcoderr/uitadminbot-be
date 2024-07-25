import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { Admin, AdminSchema, ChatUser, ChatUserSchema, User, UserSchema } from 'src/shared/entities';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
