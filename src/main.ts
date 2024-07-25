import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './shared/filters';
import { ResponseInterceptor } from './shared/interceptors';
import { SESSION_NAME } from './shared/constants';
import { JwtAuthGuard } from './shared/guards';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MemoryStore = require('memorystore')(session);

const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.use(
    session({
      name: SESSION_NAME,
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      },
      store: new MemoryStore({
        checkPeriod: 86400000
      })
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const logger = app.get(Logger);

  signalsNames.forEach((signalName) =>
    process.on(signalName, (signal) => {
      logger.log(`Retrieved signal: ${signal}, application terminated`);
      process.exit(0);
    })
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error({ err: error });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection, reason: ${reason}`);
    promise.catch((err: Error) => {
      logger.error({ err });
      process.exit(1);
    });
  });

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}
bootstrap();
