import { Module } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { ImageStoreController } from './image-store.controller';
import { OssModule } from 'src/oss/oss.module';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [OssModule, ProxyModule],
  controllers: [ImageStoreController],
  providers: [ImageStoreService],
})
export class ImageStoreModule {}
