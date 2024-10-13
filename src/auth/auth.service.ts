import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CredentialService } from 'src/credential/credential.service';
import { User } from 'src/shared/entities';
import { IDataFilter, ITokenPayload } from 'src/shared/interfaces';
import { HashHelperService } from 'src/shared/helpers';
import { EAuthStrategy, ERole } from 'src/shared/enums';
import { AdminRegisterDto, ChatUserRegisterDto, LoginDto, SuperAdminRegisterDto } from './auth.dto';
import * as moment from 'moment';
import { ChatRoomService } from 'src/chat-room/chat-room.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: ChatRoomService,
    private readonly hashHelper: HashHelperService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly credentialService: CredentialService
  ) {}

  async signJwtToken(user: User, accessTokenExpirationTime: number, refreshTokenExpirationTime: number) {
    const payload: ITokenPayload = {
      userId: user._id.toString(),
      role: user.role
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpirationTime,
        secret: this.configService.get('JWT_SECRET')
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshTokenExpirationTime,
        secret: this.configService.get('JWT_SECRET')
      }),
      accessTokenExpiration: accessTokenExpirationTime,
      refreshTokenExpiration: refreshTokenExpirationTime
    };
  }

  async signJwtTokenUser(user: User) {
    const accessTokenExpirationTime = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    const refreshTokenExpirationTime = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    return this.signJwtToken(
      user,
      this.timeStringToMilliseconds(accessTokenExpirationTime),
      this.timeStringToMilliseconds(refreshTokenExpirationTime)
    );
  }

  async signJwtTokenChatUser(user: User) {
    return this.signJwtToken(user, this.timeStringToMilliseconds('10y'), this.timeStringToMilliseconds('11y'));
  }

  async login(user: User) {
    const tokens = await this.signJwtTokenUser(user);

    return {
      ...tokens,
      user
    };
  }

  async createSuperAdmin(data: SuperAdminRegisterDto) {
    if (this.configService.get('AUTH_HEADER_ADMIN_SECRET') !== data.authKey) {
      throw new BadRequestException('Khoá xác thực không hợp lệ');
    }
    return this.createAdmin(data, true);
  }

  async createAdmin(data: AdminRegisterDto, isSuperAdmin = false) {
    const { email, password } = data;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('Email đã tồn tại');
    }

    const newUser = await this.userService.createAdmin({
      role: isSuperAdmin ? ERole.SUPER_ADMIN : ERole.ADMIN,
      authStrategy: EAuthStrategy.LOCAL,
      ...data
    });

    const hashedPassword = await this.hashHelper.hashPassword(password);

    await this.credentialService.create({
      user: newUser,
      password: hashedPassword
    });

    const tokens = await this.signJwtTokenUser(newUser);

    return {
      ...tokens,
      user: newUser
    };
  }

  async createChatUser(data: ChatUserRegisterDto) {
    const newUser = await this.userService.createChatUser({
      role: ERole.CHAT_USER,
      authStrategy: EAuthStrategy.GUEST,
      ...data
    });

    const tokens = await this.signJwtTokenChatUser(newUser);

    return {
      ...tokens,
      user: newUser,
      accessTokenExpiration: this.timeStringToMilliseconds('10y'),
      refreshTokenExpiration: this.timeStringToMilliseconds('11y')
    };
  }

  async validateUser(data: LoginDto) {
    const user = await this.userService.getUserByEmailOrThrow(data.email);

    if (user.authStrategy === EAuthStrategy.GUEST || user.authStrategy === EAuthStrategy.GOOGLE) {
      return user;
    }

    const credential = await this.credentialService.findByUserId(user._id);

    const isMatchPassword = await this.hashHelper.comparePassword(data.password, credential.password);

    if (!isMatchPassword) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
      ignoreExpiration: true
    });

    const { userId, iat, exp } = payload;
    const expSecond = exp * 1000;

    if (expSecond < Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userService.getUser(userId);

    return this.signJwtTokenUser(user);
  }

  async countAdminList(keyword: string) {
    return await this.userService.countAdmins(keyword);
  }

  async getAdmins({ keyword = '', page = 1, limit = 10 }: IDataFilter) {
    return await this.userService.getAdmins({
      keyword,
      page,
      limit
    });
  }

  async banAdmin(userId: string) {
    return await this.userService.banAdmin(userId);
  }

  private timeStringToMilliseconds(timeString: string = '1d') {
    const time = parseInt(timeString.slice(0, -1), 10);
    const unit = timeString.slice(-1);

    switch (unit) {
      case 'y':
      case 'Y':
        return moment().add(time, 'years').valueOf();
      case 'M':
        return moment().add(time, 'months').valueOf();
      case 'w':
      case 'W':
        return moment().add(time, 'weeks').valueOf();
      case 'd':
      case 'D':
        return moment().add(time, 'days').valueOf();
      case 'h':
      case 'H':
        return moment().add(time, 'hours').valueOf();
      case 'm':
        return moment().add(time, 'minutes').valueOf();
      case 's':
      case 'S':
        return moment().add(time, 'seconds').valueOf();
      default:
        return moment().add(time, 'days').valueOf();
    }
  }

  async getChatUserRoom(userId: string) {
    return await this.roomService.getUserChatRoom(userId);
  }
}
