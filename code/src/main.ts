import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomHttpExceptionFilter } from './common/filter/customer-exception.filter';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { PostCreateStatusCodeInterceptor } from './common/interceptor/post-create-status-code.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.DOMAIN_NAME || ''], // 允许的源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的 HTTP 方法
    allowedHeaders: [
      'Content-Type',
      'Dnt',
      'Referer',
      'User-Agent',
      'Origin',
      'Authorization',
    ], // 允许的 HTTP 头
  });

  app.setGlobalPrefix('api/v2');
  app.useGlobalFilters(
    new CustomHttpExceptionFilter(),
    new HttpExceptionFilter(),
  );
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

  if (process.env.ENABLE_SWAGGER === 'true') {
    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-doc', app, document);
  }

  await app.listen(8888);
}

bootstrap();
