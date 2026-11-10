import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AddressInfo } from 'net';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

const DATABASE_ENV = /^(MONGO|REDIS|MYSQL)_/;
const BOOT_TIMEOUT_MS = 5000;

function failAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(new Error(`app did not start listening within ${ms}ms`)),
      ms,
    ).unref();
  });
}

// FC 实例上没有任何数据库：启动只依赖 OSS 和 HTTP_SECRET，不能等任何库连接。
describe('AppModule 不依赖任何数据库启动', () => {
  const originalEnv = process.env;
  let app: INestApplication | undefined;

  beforeAll(() => {
    process.env = Object.fromEntries(
      Object.entries(originalEnv).filter(([key]) => !DATABASE_ENV.test(key)),
    );
    Object.assign(process.env, {
      HTTP_SECRET: 'boot-test-secret',
      INTERNAL_END_POINT: 'oss-cn-hongkong-internal.aliyuncs.com',
      OSS_ACCESS_KEY_ID: 'dummy-id',
      OSS_ACCESS_KEY_SECRET: 'dummy-secret',
      OSS_BUCKET: 'dummy-bucket',
    });
  });

  afterAll(async () => {
    await app?.close();
    process.env = originalEnv;
  });

  it('没有 Mongo / Redis / MySQL 环境变量时也能在短时间内监听端口，两个接口都要鉴权', async () => {
    const boot = async () => {
      app = await NestFactory.create(AppModule, {
        logger: false,
        abortOnError: false,
      });
      configureApp(app);
      await app.listen(0);
      return app;
    };

    const started = await Promise.race([boot(), failAfter(BOOT_TIMEOUT_MS)]);

    const server = started.getHttpServer();
    expect((server.address() as AddressInfo).port).toBeGreaterThan(0);
    await request(server).post('/api/v2/proxy').send({}).expect(403);
    await request(server)
      .post('/api/v2/image-store/download')
      .send({})
      .expect(403);
  }, 10000);
});
