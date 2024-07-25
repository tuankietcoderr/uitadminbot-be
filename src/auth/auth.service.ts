import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CredentialService } from 'src/credential/credential.service';
import { User } from 'src/shared/entities';
import { IGoogleLoginResponse, ITokenPayload } from 'src/shared/interfaces';
import { HashHelperService } from 'src/shared/helpers';
import { EAuthStrategy, ERole } from 'src/shared/enums';
import { AdminRegisterDto, ChatUserRegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashHelper: HashHelperService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly credentialService: CredentialService
  ) {}

  async signJwtToken(user: User, accessTokenExpirationTime: string, refreshTokenExpirationTime: string) {
    const payload: ITokenPayload = {
      userId: user._id.toString()
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpirationTime,
        secret: this.configService.get('JWT_SECRET')
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshTokenExpirationTime,
        secret: this.configService.get('JWT_SECRET')
      })
    };
  }

  async signJwtTokenUser(user: User) {
    const accessTokenExpirationTime = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    const refreshTokenExpirationTime = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    return this.signJwtToken(user, accessTokenExpirationTime, refreshTokenExpirationTime);
  }

  async signJwtTokenChatUser(user: User) {
    return this.signJwtToken(user, '10y', '11y');
  }

  async login(user: User) {
    const tokens = await this.signJwtTokenUser(user);

    return {
      ...tokens,
      user
    };
  }

  async googleLogin(user: IGoogleLoginResponse) {
    const { email, name, isEmailVerified, picture } = user;
    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      const res = await this.login(existingUser);
      return {
        isRegistered: true,
        ...res
      };
    }

    const newUser = await this.userService.newAdmin({
      role: ERole.ADMIN,
      email,
      name,
      avatar: picture,
      isEmailVerified
    });

    return {
      isRegistered: false,
      user: newUser
    };
  }

  async createAdmin(data: AdminRegisterDto) {
    if (this.configService.get('AUTH_HEADER_ADMIN_SECRET') !== data.authKey) {
      throw new BadRequestException('Invalid auth key');
    }
    const { email, password } = data;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.userService.createAdmin({
      role: ERole.ADMIN,
      authStrategy: EAuthStrategy.GOOGLE,
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
      user: newUser
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
      throw new BadRequestException('Wrong password');
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET')
    });

    const user = await this.userService.getUser(payload.userId);

    return this.signJwtTokenUser(user);
  }
}
