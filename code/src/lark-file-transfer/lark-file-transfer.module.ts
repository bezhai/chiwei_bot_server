import { Module } from '@nestjs/common';
import { LarkFileTransferController } from './lark-file-transfer.controller';
import { LarkFileTransferService } from './lark-file-transfer.service';
import { LarkModule } from '../lark/lark.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTransferCache } from './entities/file-transfer-cache.entity';

@Module({
  imports: [
    LarkModule,
    HttpModule,
    TypeOrmModule.forFeature([FileTransferCache]),
  ],
  controllers: [LarkFileTransferController],
  providers: [LarkFileTransferService],
  exports: [LarkFileTransferService],
})
export class LarkFileTransferModule {}
