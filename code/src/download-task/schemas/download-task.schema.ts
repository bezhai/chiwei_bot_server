import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DownloadTaskStatus } from '../enums/download-task-status.enum';

export type DownloadTaskDocument = HydratedDocument<DownloadTask>;

@Schema({ collection: 'download_task' })
export class DownloadTask {
  @Prop({ required: true, unique: true })
  illust_id: string;

  @Prop({ required: true, enum: DownloadTaskStatus, type: Number })
  status: DownloadTaskStatus;

  @Prop({ type: Date, default: Date.now, immutable: true })
  create_time: Date;

  @Prop({ type: Date, default: Date.now })
  update_time: Date;

  @Prop()
  retry_time: number;

  @Prop()
  last_run_time: Date;

  @Prop()
  last_run_error: string;
}

export const DownloadTaskSchema = SchemaFactory.createForClass(DownloadTask);

DownloadTaskSchema.pre('save', function (next) {
  if (this.isModified('update_time') || this.isNew) {
    this['update_time'] = new Date();
  }
  next();
});
