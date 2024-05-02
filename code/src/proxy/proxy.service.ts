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

  private async buildHeaders(proxyRequestDto: ProxyRequestDto): Promise<any> {
    const headers = {
      'user-agent': await this.getValueFromRedis('user-agent'),
      referer: proxyRequestDto.referer,
      cookie: await this.getValueFromRedis('cookie'),
      'sec-ch-ua': await this.getValueFromRedis('sec-ch-ua'),
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'macOS',
      ...proxyRequestDto.headers,
    };
    return headers;
  }

  async proxyRequest(proxyRequestDto: ProxyRequestDto): Promise<any> {
    const headers = await this.buildHeaders(proxyRequestDto);

    const response = await this.httpService
      .get(proxyRequestDto.url, { headers })
      .toPromise();

    return {
      body: response?.data,
      headers: response?.headers,
    };
  }

  async proxyRequestBuffer(proxyRequestDto: ProxyRequestDto): Promise<Buffer> {
    const headers = await this.buildHeaders(proxyRequestDto);

    const response = await this.httpService
      .get(proxyRequestDto.url, { headers, responseType: 'arraybuffer' })
      .toPromise();

    const imageBuffer = Buffer.from(response?.data);

    return imageBuffer;
  }

  private async getValueFromRedis(key: string): Promise<string> {
    return (await this.redis.get(key)) || '';
  }
}
