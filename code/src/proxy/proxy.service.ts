import { Injectable } from '@nestjs/common';
import { ProxyRequestDto } from './dto/proxy-request.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  // 鉴权头只来自请求里的 pixiv_auth，cookie 和 user_agent 非空由 DTO 校验保证。
  private buildHeaders({
    referer,
    pixiv_auth: auth,
  }: ProxyRequestDto): Record<string, string> {
    return {
      'user-agent': auth.user_agent,
      referer,
      cookie: auth.cookie,
      ...(auth.sec_ch_ua ? { 'sec-ch-ua': auth.sec_ch_ua } : {}),
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'macOS',
    };
  }

  async proxyRequest(proxyRequestDto: ProxyRequestDto): Promise<any> {
    const headers = this.buildHeaders(proxyRequestDto);

    const response = await this.httpService
      .get(proxyRequestDto.url, { headers })
      .toPromise();

    return {
      body: response?.data,
      headers: response?.headers,
    };
  }

  async proxyRequestBuffer(proxyRequestDto: ProxyRequestDto): Promise<Buffer> {
    const headers = this.buildHeaders(proxyRequestDto);

    const response = await this.httpService
      .get(proxyRequestDto.url, { headers, responseType: 'arraybuffer' })
      .toPromise();

    const imageBuffer = Buffer.from(response?.data);

    return imageBuffer;
  }
}
