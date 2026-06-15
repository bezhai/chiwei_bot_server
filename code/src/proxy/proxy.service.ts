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
    const auth = proxyRequestDto.pixiv_auth ?? {};
    // 逐字段：调用方带入且非空就用带入值，否则（缺失 / 空串）回退读自己的 Redis。
    // 空串必须当"未带入"，否则 Dynamic Config 缺值时会把空 header 发给 pixiv。
    const headers = {
      'user-agent':
        auth.user_agent || (await this.getValueFromRedis('user-agent')),
      referer: proxyRequestDto.referer,
      cookie: auth.cookie || (await this.getValueFromRedis('cookie')),
      'sec-ch-ua': auth.sec_ch_ua || (await this.getValueFromRedis('sec-ch-ua')),
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'macOS',
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
