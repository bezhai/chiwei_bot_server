import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TranslateWordDocument = HydratedDocument<TranslateWord>;

@Schema()
export class TranslateWordExtra {
  @Prop()
  zh?: string;

  @Prop()
  en?: string;
}

export const TranslateWordExtraSchema =
  SchemaFactory.createForClass(TranslateWordExtra);

@Schema({ collection: 'trans_map' }) // 指定集合名称
export class TranslateWord {
  @Prop({ required: true })
  origin: string;

  @Prop()
  translation?: string;

  @Prop({ required: true })
  has_translate: boolean;

  @Prop({ type: TranslateWordExtraSchema })
  extra_info?: TranslateWordExtra;
}

export const TranslateWordSchema = SchemaFactory.createForClass(TranslateWord);
