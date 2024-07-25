import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument, ChatUser, ChatUserDocument, User, UserDocument } from 'src/shared/entities';
import { EAuthStrategy } from 'src/shared/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(ChatUser.name) private readonly chatUserModel: Model<ChatUserDocument>
  ) {}

  async getUsers() {
    return this.userModel.find();
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with _id ${userId} not found`);
    }

    return user;
  }

  async getUserByEmailOrThrow(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async createUser(data: Partial<User>) {
    const user = await this.userModel.create(data);

    return user;
  }

  async createAdmin(data: Partial<Admin>) {
    const admin = await this.adminModel.create(data);

    return admin;
  }

  async newAdmin(data: Partial<Admin>) {
    return new this.adminModel(data);
  }

  async createChatUser(data: Partial<ChatUser>) {
    const chatUser = await this.chatUserModel.create(data);

    return chatUser;
  }
}
