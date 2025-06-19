import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  DeleteTranslationDto,
  ListTranslationDto,
  UpdateTranslationDto,
} from './dto/translation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TranslateWord } from './schemas/translation.schemas';
import { FilterQuery, Model } from 'mongoose';
import { PaginationResponse } from 'src/common/responses/pagination-response';
import { BaseService } from 'src/core/base.service';
import { DeleteResult } from 'mongodb';
import { ImageStoreService } from 'src/image-store/image-store.service';

@Injectable()
export class TranslationService extends BaseService {
  constructor(
    @InjectModel(TranslateWord.name)
    private readonly translateWordModel: Model<TranslateWord>,
    @Inject(forwardRef(() => ImageStoreService))
    private readonly imageStoreService: ImageStoreService,
  ) {
    super();
  }
  async deleteTranslation(
    deleteTranslationDto: DeleteTranslationDto,
  ): Promise<DeleteResult> {
    const result = await this.translateWordModel.deleteOne({
      origin: deleteTranslationDto.origin,
    });

    this.logger.log(`Delete operation result: ${JSON.stringify(result)}`);

    if (result.deletedCount === 0) {
      this.logger.warn(
        `No document found with origin: ${deleteTranslationDto.origin}`,
      );
    }

    return result;
  }

  async updateTranslation(updateTranslationDto: UpdateTranslationDto) {
    this.logger.debug(`Received DTO: ${JSON.stringify(updateTranslationDto)}`);

    const result = await this.translateWordModel.updateMany(
      { origin: updateTranslationDto.origin },
      {
        $set: {
          translation: updateTranslationDto.translation,
          has_translate: true,
        },
      },
    );

    this.logger.log(`Update result: ${JSON.stringify(result)}`);

    // 不要阻塞返回，异步更新所有图片的翻译
    this.imageStoreService
      .updateAllTranslate(
        updateTranslationDto.origin,
        updateTranslationDto.translation,
      )
      .then((res) => {
        this.logger.log(`Update all translate result: ${JSON.stringify(res)}`);
      });

    return result;
  }

  async getAllTranslation(
    listTranslationDto: ListTranslationDto,
  ): Promise<PaginationResponse<TranslateWord>> {
    const filters: Array<FilterQuery<TranslateWord>> = [];
    if (listTranslationDto.only_untranslated) {
      filters.push({ has_translate: false });
    }
    if (listTranslationDto.search_key && listTranslationDto.search_key !== '') {
      filters.push({
        $or: [
          { origin: { $regex: listTranslationDto.search_key, $options: 'i' } },
          {
            'extra_info.zh': {
              $regex: listTranslationDto.search_key,
              $options: 'i',
            },
          },
          {
            'extra_info.en': {
              $regex: listTranslationDto.search_key,
              $options: 'i',
            },
          },
        ],
      });
    }

    const query = this.translateWordModel.find(
      filters.length ? { $and: filters } : {},
    );

    query
      .skip((listTranslationDto.page - 1) * listTranslationDto.page_size)
      .limit(listTranslationDto.page_size);

    const [data, total] = await Promise.all([
      query.lean().exec(),
      this.translateWordModel
        .countDocuments(filters.length ? { $and: filters } : {})
        .exec(),
    ]);

    return { data, total };
  }
}
