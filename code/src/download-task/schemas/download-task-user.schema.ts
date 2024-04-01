import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DownloadTaskUserDocument = HydratedDocument<DownloadTaskUser>;

@Schema({ collection: 'download_task_user' })
export class DownloadTaskUser {
  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop()
  start_illust_id?: number;

  @Prop({ type: Date, default: Date.now, immutable: true })
  create_time: Date;

  @Prop({ type: Date, default: Date.now })
  update_time: Date;
}

export const DownloadTaskUserSchema =
  SchemaFactory.createForClass(DownloadTaskUser);

DownloadTaskUserSchema.pre('save', function (next) {
  if (this.isModified('update_time') || this.isNew) {
    this['update_time'] = new Date();
  }
  next();
});
