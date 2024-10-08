import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/shared/entities';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }
  deserializeUser(payload: User, done: (err: Error, user: User) => void) {
    done(null, payload);
  }
}
