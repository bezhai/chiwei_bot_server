import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';
import { PostCreateStatusCodeInterceptor } from './common/interceptor/post-create-status-code.interceptor';

// main.ts 和测试共用这一份配置，测试里的 app 和线上用同一套路由前缀、拦截器和参数校验。
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v2');
  app.useGlobalInterceptors(new PostCreateStatusCodeInterceptor());
  app.useGlobalPipes(
    new CustomValidationPipe(),
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
