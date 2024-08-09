import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument, ChatUser, ChatUserDocument, User, UserDocument } from 'src/shared/entities';
import { EAuthStrategy, ERole } from 'src/shared/enums';
import { IDataFilter } from 'src/shared/interfaces';

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
      throw new NotFoundException(`Không tìm thấy người dùng`);
    }

    return user;
  }

  async getUserByEmailOrThrow(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng`);
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

  async countAdmins(keyword: string) {
    return this.adminModel
      .countDocuments({
        $or: [{ email: { $regex: keyword, $options: 'i' } }, { name: { $regex: keyword, $options: 'i' } }]
      })
      .exec();
  }

  async getAdmins({ keyword = '', page = 1, limit = 10 }: IDataFilter) {
    return this.adminModel
      .find({
        $or: [{ email: { $regex: keyword, $options: 'i' } }, { name: { $regex: keyword, $options: 'i' } }],
        role: ERole.ADMIN
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async banAdmin(userId: string) {
    const admin = await this.adminModel.findById(userId);

    if (!admin) {
      throw new NotFoundException('Không tìm thấy Admin');
    }

    admin.isBanned = !admin.isBanned;
    await admin.save();

    return admin;
  }
}
