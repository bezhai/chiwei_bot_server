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
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  page_size: number = 10;

  @IsOptional()
  @IsBoolean()
  only_untranslated: boolean = true;
}
