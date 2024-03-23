import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SettingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string) {
    return await this.redis.get(key);
  }

  async set(key: string, value: string) {
    return await this.redis.set(key, value);
  }

  async smember(key: string) {
    return await this.redis.smembers(key);
  }

  async array_set(key: string, value: string[]) {
    return await this.redis.del(key).then(() => {
      return this.redis.sadd(key, ...value);
    });
  }
}
