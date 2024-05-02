import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateTranslationDto {
  @IsNotEmpty()
  @IsString()
  origin: string;
  @IsNotEmpty()
  @IsString()
  translation: string;
}

export class DeleteTranslationDto {
  @IsNotEmpty()
  @IsString()
  origin: string;
}

export class ListTranslationDto {
  @IsString()
  @IsOptional()
  search_key?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  page_size: number = 10;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  only_untranslated: boolean = true;
}
