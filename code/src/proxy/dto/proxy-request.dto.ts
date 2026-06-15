/**
 * pixiv 鉴权头：由内网调用方（media-sync-worker，值取自 Dynamic Config）随请求带入，
 * server 转发给 pixiv.net。字段缺失或为空串时，buildHeaders 逐字段回退读 Redis（过渡期兼容）。
 */
export interface PixivAuth {
  cookie?: string;
  user_agent?: string;
  sec_ch_ua?: string;
}

export class ProxyRequestDto {
  url: string;
  referer: string;
  headers?: { [key: string]: string };
  debug?: boolean;
  pixiv_auth?: PixivAuth;
}
