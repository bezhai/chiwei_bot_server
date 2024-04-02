import { Controller, Get, Param } from '@nestjs/common';
import { DownloadTaskService } from './download-task.service';

@Controller('download-task')
export class DownloadTaskController {
  constructor(private readonly downloadTaskService: DownloadTaskService) {}

  @Get()
  findAll() {
    return this.downloadTaskService.findAll();
  }

  @Get(':illust_id')
  findOne(@Param('illust_id') illust_id: string) {
    return this.downloadTaskService.findOne(illust_id);
  }
}
