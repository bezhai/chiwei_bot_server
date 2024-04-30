import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import {
  TranslateWord,
  TranslateWordSchema,
} from './schemas/translation.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranslateWord.name, schema: TranslateWordSchema },
    ]),
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
