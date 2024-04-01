import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DownloadTaskDocument = HydratedDocument<DownloadTask>;

@Schema()
export class DownloadTask {
  @Prop()
  illust_id: string;

  @Prop()
  r18_index: number;

  @Prop()
  status: number;

  @Prop()
  create_time: Date;

  @Prop()
  update_time: Date;

  @Prop()
  retry_time: number;

  @Prop()
  last_run_time: Date;

  @Prop()
  last_run_error: string;
}

export const DownloadTaskSchema = SchemaFactory.createForClass(DownloadTask);
