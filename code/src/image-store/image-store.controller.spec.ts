import { INestApplication } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ErrorCode } from 'src/common/consts/error-codes';
import { FakeOss } from '../../test/fakes/oss.fake';
import { FakePixivServer } from '../../test/fakes/pixiv-server.fake';
import { signedPost, startTestApp } from '../../test/test-app';

const IMAGE_PATH = '/img-original/img/2026/11/09/12/00/00/123456_p0.png';
const IMAGE = Buffer.from('fake-png-bytes');
const AUTH = { cookie: 'ck', user_agent: 'ua', sec_ch_ua: 'sec' };

function keysForDays(...days: string[]): string[] {
  return days.map((day) => `pixiv_img_v2/${day}/123456_p0.png`);
}

// media-sync-worker 在调用前已经按自己的图片目录去重，server 每次都下载、上传，
// 并把实际写入的 OSS key 经全局 ResponseInterceptor 放进 data.tos_file_name 返回。
describe('POST /api/v2/image-store/download', () => {
  let pixiv: FakePixivServer;
  let pixivUrl: string;
  let oss: FakeOss;
  let app: INestApplication;

  beforeEach(async () => {
    pixiv = new FakePixivServer(IMAGE, 'image/png');
    pixivUrl = `${await pixiv.start()}${IMAGE_PATH}`;
    oss = new FakeOss();
    app = await startTestApp(oss);
  });

  afterEach(async () => {
    await app.close();
    await pixiv.stop();
  });

  it('用 pixiv_auth 下载图片、上传 OSS，在 data 里返回实际上传的 key', async () => {
    const dayBefore = dayjs().format('YYYYMMDD');
    const res = await signedPost(app, '/api/v2/image-store/download', {
      pixiv_url: pixivUrl,
      pixiv_auth: AUTH,
    });
    const dayAfter = dayjs().format('YYYYMMDD');

    expect(res.status).toBe(200);
    expect(pixiv.received).toHaveLength(1);
    expect(pixiv.received[0].path).toBe(IMAGE_PATH);
    expect(pixiv.received[0].headers).toMatchObject({
      cookie: 'ck',
      'user-agent': 'ua',
      'sec-ch-ua': 'sec',
      referer: 'https://www.pixiv.net/artworks/123456',
    });
    expect(oss.uploads).toHaveLength(1);
    expect(keysForDays(dayBefore, dayAfter)).toContain(oss.uploads[0].key);
    expect(oss.uploads[0].content).toEqual(IMAGE);
    expect(res.body).toEqual({
      code: 0,
      msg: 'success',
      data: { tos_file_name: oss.uploads[0].key },
    });
  });

  it('同一张图再请求一次：不查重，照样下载、上传并返回 key', async () => {
    const body = { pixiv_url: pixivUrl, pixiv_auth: AUTH };

    const first = await signedPost(app, '/api/v2/image-store/download', body);
    const second = await signedPost(app, '/api/v2/image-store/download', body);

    expect(pixiv.received).toHaveLength(2);
    expect(oss.uploads).toHaveLength(2);
    expect(first.body.data).toEqual({ tos_file_name: oss.uploads[0].key });
    expect(second.body.data).toEqual({ tos_file_name: oss.uploads[1].key });
  });

  it.each([
    ['不带 pixiv_auth', undefined],
    ['cookie 为空串', { cookie: '', user_agent: 'ua' }],
    ['缺 user_agent', { cookie: 'ck' }],
    ['pixiv_auth 是空数组', []],
    ['pixiv_auth 是装着鉴权对象的数组', [{ cookie: 'ck', user_agent: 'ua' }]],
  ])('%s：返回 400，不下载也不上传', async (_label, pixivAuth) => {
    const res = await signedPost(app, '/api/v2/image-store/download', {
      pixiv_url: pixivUrl,
      pixiv_auth: pixivAuth,
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe(ErrorCode.VALIDATION_FAILED);
    expect(pixiv.received).toHaveLength(0);
    expect(oss.uploads).toHaveLength(0);
  });
});
