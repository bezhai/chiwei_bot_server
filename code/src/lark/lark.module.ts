import { Module } from '@nestjs/common';
import { LarkService } from './lark.service';

@Module({
  providers: [LarkService],
  exports: [LarkService],
})
export class LarkModule {}
