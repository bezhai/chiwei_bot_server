import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DownloadTaskService } from './download-task.service';
import {
  CreateDownloadTaskDto,
  PaginationQueryDownloadTaskDto,
} from './dto/download-task.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';

@TokenAuth()
@Controller('download-task')
export class DownloadTaskController {
  constructor(private readonly downloadTaskService: DownloadTaskService) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDownloadTaskDto) {
    return this.downloadTaskService.findAll(query);
  }

  @Get(':illust_id')
  async findOne(@Param('illust_id') illust_id: string) {
    return this.downloadTaskService.findOne(illust_id);
  }

  @Post()
  async create(@Body() createDownloadTaskDto: CreateDownloadTaskDto) {
    return this.downloadTaskService.create(createDownloadTaskDto);
  }

  @Post('token-auth')
  async create_with_token(
    @Body() createDownloadTaskDto: CreateDownloadTaskDto,
  ) {
    return this.downloadTaskService.create(createDownloadTaskDto);
  }
}
