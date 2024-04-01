import { Module } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { ImageStoreController } from './image-store.controller';

@Module({
  controllers: [ImageStoreController],
  providers: [ImageStoreService],
})
export class ImageStoreModule {}
