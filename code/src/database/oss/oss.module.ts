import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OssService } from './oss.service';

@Module({
  providers: [
    {
      provide: 'OSS_CLIENT_INTERNAL',
      useFactory: async (configService: ConfigService) => {
        return new OssService({
          endpoint: configService.get<string>('INTERNAL_END_POINT'),
          accessKeyId: configService.get<string>('OSS_ACCESS_KEY_ID', ''),
          accessKeySecret: configService.get<string>(
            'OSS_ACCESS_KEY_SECRET',
            '',
          ),
          bucket: configService.get<string>('OSS_BUCKET'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'OSS_CLIENT_EXTERNAL',
      useFactory: async (configService: ConfigService) => {
        return new OssService({
          endpoint: configService.get<string>('END_POINT'),
          accessKeyId: configService.get<string>('OSS_ACCESS_KEY_ID', ''),
          accessKeySecret: configService.get<string>(
            'OSS_ACCESS_KEY_SECRET',
            '',
          ),
          cname: true,
          bucket: configService.get<string>('OSS_BUCKET'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['OSS_CLIENT_INTERNAL', 'OSS_CLIENT_EXTERNAL'],
})
export class OssModule {}
