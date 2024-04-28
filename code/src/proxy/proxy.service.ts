import { Injectable } from '@nestjs/common';
import { ProxyRequestDto } from './dto/proxy-request.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ProxyService {
  constructor(
    private httpService: HttpService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async proxyRequest(proxyRequestDto: ProxyRequestDto): Promise<any> {
    const headers = {
      'user-agent': await this.getValueFromRedis('user-agent'),
      referer: proxyRequestDto.referer,
      cookie: await this.getValueFromRedis('cookie'),
      'sec-ch-ua': await this.getValueFromRedis('sec-ch-ua'),
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'macOS',
      ...proxyRequestDto.headers,
    };

    const response = await this.httpService
      .get(proxyRequestDto.url, { headers })
      .toPromise();

    return {
      body: response.data,
      headers: response.headers,
    };
  }

  private async getValueFromRedis(key: string): Promise<string> {
    return (await this.redis.get(key)) || '';
  }
}
