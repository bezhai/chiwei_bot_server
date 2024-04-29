import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './database/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MysqlModule } from './database/mysql/mysql.module';
import { SettingModule } from './setting/setting.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { MongodbModule } from './database/mongodb/mongodb.module';
import { ImageStoreModule } from './image-store/image-store.module';
import { DownloadTaskModule } from './download-task/download-task.module';
import { CommonModule } from './common/common.module';
import { ProxyModule } from './proxy/proxy.module';
import { OssModule } from './database/oss/oss.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MysqlModule,
    SettingModule,
    MongodbModule,
    ImageStoreModule,
    DownloadTaskModule,
    CommonModule,
    ProxyModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    Reflector,
  ],
})
export class AppModule {}
