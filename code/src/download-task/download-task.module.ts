import { Module } from '@nestjs/common';
import { DownloadTaskService } from './download-task.service';
import { DownloadTaskController } from './download-task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DownloadTask,
  DownloadTaskSchema,
} from './schemas/download-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DownloadTask.name, schema: DownloadTaskSchema },
    ]),
  ],
  controllers: [DownloadTaskController],
  providers: [DownloadTaskService],
})
export class DownloadTaskModule {}
