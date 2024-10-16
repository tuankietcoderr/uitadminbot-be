import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CredentialModule } from 'src/credential/credential.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { UserModule } from 'src/user/user.module';
import { HashHelperService } from 'src/shared/helpers';
import { AuthControllerV2 } from './auth.v2.controller';
import { JwtStrategy, LocalStrategy } from 'src/shared/strategies';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService],
      imports: [ConfigModule]
    }),
    PassportModule.register({}),
    UserModule,
    CredentialModule,
    ChatRoomModule
  ],
  controllers: [AuthController, AuthControllerV2],
  providers: [AuthService, JwtStrategy, LocalStrategy, SessionSerializer, HashHelperService]
})
export class AuthModule {}
