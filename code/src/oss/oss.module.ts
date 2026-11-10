import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OssService } from './oss.service';

// FC 和香港 OSS bucket 在同一地域，走内网 endpoint 上传。
@Module({
  providers: [
    {
      provide: OssService,
      useFactory: (configService: ConfigService) =>
        new OssService({
          endpoint: configService.get<string>('INTERNAL_END_POINT'),
          accessKeyId: configService.get<string>('OSS_ACCESS_KEY_ID', ''),
          accessKeySecret: configService.get<string>(
            'OSS_ACCESS_KEY_SECRET',
            '',
          ),
          bucket: configService.get<string>('OSS_BUCKET'),
        }),
      inject: [ConfigService],
    },
  ],
  exports: [OssService],
})
export class OssModule {}
