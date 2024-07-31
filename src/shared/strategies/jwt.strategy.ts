import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from 'src/shared/interfaces';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: true
    });
  }

  async validate({ userId, iat, exp }: ITokenPayload) {
    const expSecond = exp * 1000;
    console.log({ expSecond, now: Date.now(), diff: expSecond - Date.now() });
    if (expSecond < Date.now()) {
      throw new UnauthorizedException('Access token expired');
    }
    return await this.usersService.getUser(userId);
  }
}
