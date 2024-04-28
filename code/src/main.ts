import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomHttpExceptionFilter } from './common/filter/customer-exception.filter';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { PostCreateStatusCodeInterceptor } from './common/interceptor/post-create-status-code.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');
  app.useGlobalFilters(
    new CustomHttpExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new PostCreateStatusCodeInterceptor());
  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(8888);
}

bootstrap();
