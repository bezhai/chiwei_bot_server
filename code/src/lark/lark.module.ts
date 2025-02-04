import { Module } from '@nestjs/common';
import { LarkService } from './lark.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LarkService],
  exports: [LarkService],
})
export class LarkModule {}
