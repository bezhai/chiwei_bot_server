import { IsNotEmpty, IsString } from 'class-validator';
import { PixivAuth } from 'src/proxy/dto/proxy-request.dto';

export class DownloadImageDto {
  @IsString()
  @IsNotEmpty()
  pixiv_url: string;

  // 调用方带入的 pixiv 鉴权头，透传给 proxyRequestBuffer（缺失则 server 回退 Redis）。
  pixiv_auth?: PixivAuth;
}
