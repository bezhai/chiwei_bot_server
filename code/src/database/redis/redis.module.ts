import { Module } from '@nestjs/common';
import {
  RedisModule as NestRedisModule,
  RedisModuleOptions,
} from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<string>('REDIS_PORT', '6379');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisDb = configService.get<string>('REDIS_DB', '0');

        // 构建 url 字符串
        const url = `redis://${redisHost}:${redisPort}/${redisDb}`;

        return {
          type: 'single',
          url,
          options: {
            password: redisPassword,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
