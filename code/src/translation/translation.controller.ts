import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import {
  DeleteTranslationDto,
  ListTranslationDto,
  UpdateTranslationDto,
} from './dto/translation.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  // 更新翻译
  @Post()
  async updateTranslation(@Body() updateTranslationDto: UpdateTranslationDto) {
    return this.translationService.updateTranslation(updateTranslationDto);
  }

  // 获取翻译
  @Get()
  async getAllTranslation(@Query() listTranslationDto: ListTranslationDto) {
    return this.translationService.getAllTranslation(listTranslationDto);
  }

  @Delete()
  async deleteTranslation(@Query() deleteTranslationDto: DeleteTranslationDto) {
    return this.translationService.deleteTranslation(deleteTranslationDto);
  }
}
