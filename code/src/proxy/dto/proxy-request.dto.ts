import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * pixiv 鉴权头：由调用方（media-sync-worker，值取自 Dynamic Config）随请求带入，server 原样转发给 pixiv。
 * server 自己不保存鉴权信息，缺 cookie 或 user_agent（含空串）的请求直接 400，不带空头去请求 pixiv。
 */
export class PixivAuth {
  @IsString()
  @IsNotEmpty()
  cookie: string;

  @IsString()
  @IsNotEmpty()
  user_agent: string;

  @IsOptional()
  @IsString()
  sec_ch_ua?: string;
}

export class ProxyRequestDto {
  url: string;
  referer: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => PixivAuth)
  pixiv_auth: PixivAuth;
}
