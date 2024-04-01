import { Module } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { ImageStoreController } from './image-store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PixivImage, PixivImageSchema } from './schemas/pixiv-image.schemas';
import { OssModule } from 'src/database/oss/oss.module';
import { ProxyModule } from 'src/proxy/proxy.module';
import { LarkModule } from 'src/lark/lark.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PixivImage.name, schema: PixivImageSchema },
    ]),
    OssModule,
    ProxyModule,
    LarkModule,
  ],
  controllers: [ImageStoreController],
  providers: [ImageStoreService],
})
export class ImageStoreModule {}
