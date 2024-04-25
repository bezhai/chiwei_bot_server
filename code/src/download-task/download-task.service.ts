import { Injectable } from '@nestjs/common';
import { DownloadTask } from './schemas/download-task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDownloadTaskDto } from './dto/download-task.dto';
import { DownloadTaskStatus } from './enums/download-task-status.enum';

@Injectable()
export class DownloadTaskService {
  constructor(
    @InjectModel(DownloadTask.name)
    private downloadTaskModel: Model<DownloadTask>,
  ) {}

  async findAll(): Promise<DownloadTask[]> {
    return this.downloadTaskModel.find().exec();
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
