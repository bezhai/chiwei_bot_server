import { INestApplication } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { ServerAuthGuard } from 'src/common/guard/server-auth.guard';
import { ProxyService } from 'src/proxy/proxy.service';
import { LarkService } from 'src/lark/lark.service';
import { FakePixivImageModel } from '../../test/fakes/pixiv-image-model.fake';
import { ImageStoreController } from './image-store.controller';
import { ImageStoreService } from './image-store.service';
import { PixivImage } from './schemas/pixiv-image.schemas';

const PIXIV_URL =
  'https://i.pximg.net/img-original/img/2026/11/09/12/00/00/123456_p0.png';

// media-sync-worker 依赖的契约：POST /image-store/download 经全局 ResponseInterceptor
// 包装后，data 里带 tos_file_name。用真实的 controller、service 和拦截器，只替换外部依赖。
describe('POST /image-store/download 响应契约', () => {
  let app: INestApplication;
  let innerOss: { uploadFile: jest.Mock };

  async function startApp(docs: Array<Record<string, unknown>>) {
    innerOss = { uploadFile: jest.fn(async () => ({ res: { status: 200 } })) };
    const moduleRef = await Test.createTestingModule({
      controllers: [ImageStoreController],
      providers: [
        ImageStoreService,
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        {
          provide: getModelToken(PixivImage.name),
          useValue: new FakePixivImageModel(docs),
        },
        { provide: 'OSS_CLIENT_INTERNAL', useValue: innerOss },
        { provide: 'OSS_CLIENT_EXTERNAL', useValue: {} },
        {
          provide: ProxyService,
          useValue: { proxyRequestBuffer: async () => Buffer.from('image') },
        },
        { provide: LarkService, useValue: {} },
      ],
    })
      .overrideGuard(ServerAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  }

  afterEach(async () => {
    await app.close();
  });

  it('已存在：data 里返回库里存的 tos_file_name', async () => {
    const storedKey = 'pixiv_img_v2/20250101/123456_p0.png';
    await startApp([{ pixiv_addr: '123456_p0.png', tos_file_name: storedKey }]);

    const res = await request(app.getHttpServer())
      .post('/image-store/download')
      .send({ pixiv_url: PIXIV_URL });

    expect(res.body).toEqual({
      code: 0,
      msg: 'success',
      data: { tos_file_name: storedKey },
    });
  });

  it('新上传：data 里返回实际上传用的 tos_file_name', async () => {
    await startApp([]);

    const res = await request(app.getHttpServer())
      .post('/image-store/download')
      .send({ pixiv_url: PIXIV_URL });

    expect(innerOss.uploadFile).toHaveBeenCalledTimes(1);
    const uploadedKey = innerOss.uploadFile.mock.calls[0][0];
    expect(uploadedKey).toMatch(/^pixiv_img_v2\/\d{8}\/123456_p0\.png$/);
    expect(res.body).toEqual({
      code: 0,
      msg: 'success',
      data: { tos_file_name: uploadedKey },
    });
  });
});
