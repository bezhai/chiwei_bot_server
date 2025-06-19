import { forwardRef, Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import {
  TranslateWord,
  TranslateWordSchema,
} from './schemas/translation.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageStoreModule } from 'src/image-store/image-store.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranslateWord.name, schema: TranslateWordSchema },
    ]),
    forwardRef(() => ImageStoreModule),
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
