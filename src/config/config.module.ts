import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AI_HOST: Joi.string().required(),
        CORS_ORIGIN: Joi.string().required(),
        SESSION_SECRET: Joi.string().required(),
        MESSAGE_SESSION_TIMEOUT: Joi.number().required(),

        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        AUTH_HEADER_ADMIN_SECRET: Joi.string().required(),

        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CHEAT_RESPONSE_TIME: Joi.number().required()
      }),
      isGlobal: true
    })
  ]
})
export class GlobalConfigModule {}
