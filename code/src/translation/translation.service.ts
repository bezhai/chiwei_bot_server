import { Injectable } from '@nestjs/common';
import {
  DeleteTranslationDto,
  ListTranslationDto,
  UpdateTranslationDto,
} from './dto/translation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TranslateWord } from './schemas/translation.schemas';
import { FilterQuery, Model } from 'mongoose';
import { PaginationResponse } from 'src/common/responses/pagination-response';

@Injectable()
export class TranslationService {
  constructor(
    @InjectModel(TranslateWord.name)
    private readonly translateWordModel: Model<TranslateWord>,
  ) {}
  async deleteTranslation(deleteTranslationDto: DeleteTranslationDto) {
    this.translateWordModel.deleteOne({
      origin: deleteTranslationDto.origin,
    });
  }
  async updateTranslation(updateTranslationDto: UpdateTranslationDto) {
    this.translateWordModel.updateOne(
      {
        origin: updateTranslationDto.origin,
      },
      {
        translation: updateTranslationDto.translation,
      },
    );
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
