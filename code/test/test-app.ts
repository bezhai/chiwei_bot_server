import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/app.setup';
import { generateToken } from 'src/common/utils/auth.utils';
import { OssService } from 'src/oss/oss.service';
import { FakeOss } from './fakes/oss.fake';

const HTTP_SECRET = 'test-http-secret';

// 真实的 AppModule 加上和 main.ts 同一套全局配置，只把 OSS 换成假的。
export async function startTestApp(oss: FakeOss): Promise<INestApplication> {
  process.env.HTTP_SECRET = HTTP_SECRET;
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(OssService)
    .useValue(oss)
    .compile();
  const app = moduleRef.createNestApplication({ logger: false });
  configureApp(app);
  await app.init();
  return app;
}

// 和 media-sync-worker 的 pixiv-client 同样签名：x-token = sha256(salt + JSON body + HTTP_SECRET)。
export function signedPost(app: INestApplication, path: string, body: object) {
  const salt = 'test-salt';
  return request(app.getHttpServer())
    .post(path)
    .set('x-salt', salt)
    .set('x-token', generateToken(salt, JSON.stringify(body), HTTP_SECRET))
    .send(body);
}
