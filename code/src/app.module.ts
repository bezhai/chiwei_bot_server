import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        END_POINT: Joi.string().required(),
        INTERNAL_END_POINT: Joi.string().required(),
        LARK_APP_ID: Joi.string().required(),
        LARK_APP_SECRET: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_SERVER_IP: Joi.string().required(),
        OSS_ACCESS_KEY_ID: Joi.string().required(),
        OSS_ACCESS_KEY_SECRET: Joi.string().required(),
        OSS_BUCKET: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_SERVER_IP: Joi.string().required(),
        HTTP_SECRET: Joi.string().required(),
        HTTP_JWT_KEY: Joi.string().required(),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQL_SERVER_IP: Joi.string().required(),
        MYSQL_DBNAME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
