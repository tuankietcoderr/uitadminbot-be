import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGoogleLoginResponse } from '../interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile', '']
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const {
      name,
      _json: { email, email_verified, picture }
    } = profile;
    const user: IGoogleLoginResponse = {
      email: email,
      name: [name.givenName, name.familyName].filter(Boolean).join(' '),
      picture: picture || null,
      isEmailVerified: email_verified
    };
    done(null, user);
  }
}
