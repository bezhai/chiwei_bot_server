import { INestApplication } from '@nestjs/common';
import { ErrorCode } from 'src/common/consts/error-codes';
import { FakeOss } from '../../test/fakes/oss.fake';
import { FakePixivServer } from '../../test/fakes/pixiv-server.fake';
import { signedPost, startTestApp } from '../../test/test-app';

const PIXIV_RESPONSE = { error: false, message: '', body: { illust: 1 } };
const REFERER = 'https://www.pixiv.net/artworks/123456';

// server 不保存任何 pixiv 鉴权信息，cookie / user-agent / sec-ch-ua 只能来自请求里的 pixiv_auth。
describe('POST /api/v2/proxy', () => {
  let pixiv: FakePixivServer;
  let pixivBase: string;
  let app: INestApplication;

  beforeEach(async () => {
    pixiv = new FakePixivServer(
      JSON.stringify(PIXIV_RESPONSE),
      'application/json',
    );
    pixivBase = await pixiv.start();
    app = await startTestApp(new FakeOss());
  });

  afterEach(async () => {
    await app.close();
    await pixiv.stop();
  });

  const ajaxRequest = () => ({
    url: `${pixivBase}/ajax/illust/123456?lang=zh`,
    referer: REFERER,
  });

  it('pixiv_auth 三项都带：原样作为请求头发给 pixiv，返回 pixiv 的响应', async () => {
    const res = await signedPost(app, '/api/v2/proxy', {
      ...ajaxRequest(),
      pixiv_auth: { cookie: 'ck', user_agent: 'ua', sec_ch_ua: 'sec' },
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(PIXIV_RESPONSE);
    expect(pixiv.received).toHaveLength(1);
    expect(pixiv.received[0].path).toBe('/ajax/illust/123456?lang=zh');
    expect(pixiv.received[0].headers).toMatchObject({
      cookie: 'ck',
      'user-agent': 'ua',
      'sec-ch-ua': 'sec',
      referer: REFERER,
    });
  });

  it.each([
    ['不带 sec_ch_ua', { cookie: 'ck', user_agent: 'ua' }],
    ['sec_ch_ua 为空串', { cookie: 'ck', user_agent: 'ua', sec_ch_ua: '' }],
  ])('%s：不发 sec-ch-ua 头', async (_label, pixivAuth) => {
    const res = await signedPost(app, '/api/v2/proxy', {
      ...ajaxRequest(),
      pixiv_auth: pixivAuth,
    });

    expect(res.status).toBe(200);
    expect(pixiv.received).toHaveLength(1);
    expect(pixiv.received[0].headers).toMatchObject({
      cookie: 'ck',
      'user-agent': 'ua',
    });
    expect(pixiv.received[0].headers).not.toHaveProperty('sec-ch-ua');
  });

  it.each([
    ['不带 pixiv_auth', undefined],
    ['缺 cookie', { user_agent: 'ua', sec_ch_ua: 'sec' }],
    ['cookie 为空串', { cookie: '', user_agent: 'ua', sec_ch_ua: 'sec' }],
    ['缺 user_agent', { cookie: 'ck', sec_ch_ua: 'sec' }],
    ['user_agent 为空串', { cookie: 'ck', user_agent: '', sec_ch_ua: 'sec' }],
    ['pixiv_auth 是空数组', []],
    ['pixiv_auth 是装着鉴权对象的数组', [{ cookie: 'ck', user_agent: 'ua' }]],
  ])('%s：返回 400，不向 pixiv 发请求', async (_label, pixivAuth) => {
    const res = await signedPost(app, '/api/v2/proxy', {
      ...ajaxRequest(),
      pixiv_auth: pixivAuth,
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe(ErrorCode.VALIDATION_FAILED);
    expect(pixiv.received).toHaveLength(0);
  });
});
