import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DownloadTaskService } from './download-task.service';
import { CreateDownloadTaskDto } from './dto/download-task.dto';
import { ServerAuthGuard } from 'src/common/guard/server-auth.guard';
import { TokenAuth } from 'src/common/decorator/auth.decorator';

@Controller('download-task')
export class DownloadTaskController {
  constructor(private readonly downloadTaskService: DownloadTaskService) {}

  @Get()
  async findAll() {
    return this.downloadTaskService.findAll();
  }

  @Get(':illust_id')
  async findOne(@Param('illust_id') illust_id: string) {
    return this.downloadTaskService.findOne(illust_id);
  }

  @Post()
  async create(@Body() createDownloadTaskDto: CreateDownloadTaskDto) {
    return this.downloadTaskService.create(createDownloadTaskDto);
  }

  @TokenAuth()
  @Post('token-auth')
  async create_with_token(
    @Body() createDownloadTaskDto: CreateDownloadTaskDto,
  ) {
    return this.downloadTaskService.create(createDownloadTaskDto);
  }
}
