import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import * as pino from 'pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        stream: pino.destination({
          dest: `logs/${new Date().toISOString().split('T')[0]}.log`,
          sync: false,
          mkdir: true
        })
      }
    })
  ]
})
export class LoggerModule {}
