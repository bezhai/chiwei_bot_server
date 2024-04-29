import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PixivImageDocument = HydratedDocument<PixivImage>;

export class MultiTag {
  @Prop({ required: true })
  name: string;

  @Prop()
  translation?: string;

  @Prop()
  visible?: boolean;
}

@Schema({ collection: 'img_map' })
export class PixivImage {
  @Prop({ required: true, unique: true })
  pixiv_addr: string;

  @Prop({ required: true, default: false })
  visible: boolean;

  @Prop()
  author?: string;

  @Prop({ required: true, default: Date.now, immutable: true })
  create_time: Date;

  @Prop({ required: true, default: Date.now })
  update_time: Date;

  @Prop({ required: true })
  tos_file_name: string;

  @Prop({ required: true })
  illust_id: number;

  @Prop()
  title?: string;

  @Prop({ required: true, default: false })
  del_flag: boolean;

  @Prop()
  author_id?: string;

  @Prop()
  image_key?: string;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop({ type: [MultiTag], default: [] })
  multi_tags: MultiTag[];
}
export const PixivImageSchema = SchemaFactory.createForClass(PixivImage);

PixivImageSchema.pre('save', function (next) {
  if (this.isModified('update_time') || this.isNew) {
    this['update_time'] = new Date();
  }
  next();
});
