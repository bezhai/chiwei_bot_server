import { ProxyService } from './proxy.service';

// 直接构造 ProxyService（注入假的 HttpService + Redis），避开 NestJS DI——
// 我们只验 buildHeaders 的"调用方鉴权头优先、缺失逐字段回退 Redis"逻辑。
function makeService(redisMap: Record<string, string>) {
  const captured: Array<{ url: string; headers: any }> = [];
  const httpService: any = {
    get: (url: string, config: any) => {
      captured.push({ url, headers: config?.headers });
      return { toPromise: async () => ({ data: 'ok', headers: {} }) };
    },
  };
  const redis: any = { get: async (key: string) => redisMap[key] ?? '' };
  const service = new ProxyService(httpService, redis);
  return { service, captured };
}

const REDIS = {
  'user-agent': 'redis-ua',
  cookie: 'redis-ck',
  'sec-ch-ua': 'redis-sec',
};

describe('ProxyService 鉴权头来源（调用方优先、逐字段回退 Redis）', () => {
  it('带完整 pixiv_auth：三项都用调用方带入值', async () => {
    const { service, captured } = makeService(REDIS);
    await service.proxyRequest({
      url: 'https://www.pixiv.net/ajax/x',
      referer: 'ref',
      pixiv_auth: { cookie: 'ck', user_agent: 'ua', sec_ch_ua: 'sec' },
    } as any);

    expect(captured[0].headers.cookie).toBe('ck');
    expect(captured[0].headers['user-agent']).toBe('ua');
    expect(captured[0].headers['sec-ch-ua']).toBe('sec');
    expect(captured[0].headers.referer).toBe('ref');
  });

  it('不带 pixiv_auth：三项全回退 Redis（零回归）', async () => {
    const { service, captured } = makeService(REDIS);
    await service.proxyRequest({ url: 'https://p', referer: 'ref' } as any);

    expect(captured[0].headers.cookie).toBe('redis-ck');
    expect(captured[0].headers['user-agent']).toBe('redis-ua');
    expect(captured[0].headers['sec-ch-ua']).toBe('redis-sec');
  });

  it('部分 pixiv_auth：给的用带入、缺的逐字段回退 Redis', async () => {
    const { service, captured } = makeService(REDIS);
    await service.proxyRequest({
      url: 'https://p',
      referer: 'ref',
      pixiv_auth: { cookie: 'ck' },
    } as any);

    expect(captured[0].headers.cookie).toBe('ck');
    expect(captured[0].headers['user-agent']).toBe('redis-ua');
    expect(captured[0].headers['sec-ch-ua']).toBe('redis-sec');
  });

  it('pixiv_auth 字段为空串：当未提供、回退 Redis', async () => {
    const { service, captured } = makeService(REDIS);
    await service.proxyRequest({
      url: 'https://p',
      referer: 'ref',
      pixiv_auth: { cookie: '', user_agent: 'ua' },
    } as any);

    expect(captured[0].headers.cookie).toBe('redis-ck');
    expect(captured[0].headers['user-agent']).toBe('ua');
  });

  it('proxyRequestBuffer 同样走调用方鉴权头', async () => {
    const { service, captured } = makeService(REDIS);
    await service.proxyRequestBuffer({
      url: 'https://i.pximg.net/x_p0.png',
      referer: 'ref',
      pixiv_auth: { cookie: 'ck', user_agent: 'ua', sec_ch_ua: 'sec' },
    } as any);

    expect(captured[0].headers.cookie).toBe('ck');
    expect(captured[0].headers['user-agent']).toBe('ua');
    expect(captured[0].headers['sec-ch-ua']).toBe('sec');
  });
});
