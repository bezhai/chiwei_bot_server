import { Injectable } from '@nestjs/common';
import { DownloadTask } from './schemas/download-task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateDownloadTaskDto,
  PaginationQueryDownloadTaskDto,
} from './dto/download-task.dto';
import { DownloadTaskStatus } from './enums/download-task-status.enum';
import { PaginationResponse } from 'src/common/responses/pagination-response';

@Injectable()
export class DownloadTaskService {
  constructor(
    @InjectModel(DownloadTask.name)
    private downloadTaskModel: Model<DownloadTask>,
  ) {}

  async findAll(
    query: PaginationQueryDownloadTaskDto,
  ): Promise<PaginationResponse<DownloadTask>> {
    const { skip, page_size } = query;
    const total = await this.downloadTaskModel.countDocuments().exec();
    const data = await this.downloadTaskModel
      .find()
      .skip(skip)
      .limit(page_size)
      .sort({ _id: -1 })
      .exec();
    return new PaginationResponse({
      total,
      page: query.page,
      page_size: query.page_size,
      data,
    });
  }

  async findOne(illust_id: string): Promise<DownloadTask | null> {
    return this.downloadTaskModel.findOne({ illust_id: illust_id }).exec();
  }

  async create(createDto: CreateDownloadTaskDto): Promise<DownloadTask> {
    const existDownloadTask = await this.findOne(createDto.illust_id);
    if (existDownloadTask) {
      return existDownloadTask;
    }
    const createdDownloadTask = new this.downloadTaskModel({
      ...createDto,
      status: DownloadTaskStatus.PENDING,
      retry_time: 0,
    });
    return createdDownloadTask.save();
  }
}
