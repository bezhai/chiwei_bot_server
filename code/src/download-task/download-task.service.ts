import { Injectable } from '@nestjs/common';
import { DownloadTask } from './schemas/download-task.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async create(downloadTask: DownloadTask): Promise<DownloadTask> {
    const createdDownloadTask = new this.downloadTaskModel(downloadTask);
    return createdDownloadTask.save();
  }
}
