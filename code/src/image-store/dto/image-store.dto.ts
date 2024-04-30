import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export enum StatusMode {
  NOT_DELETE = 0,
  VISIBLE = 1,
  DELETE = 2,
  ALL = 3,
  NO_VISIBLE = 4,
}

export class ListPixivImageDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  author_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsEnum(StatusMode)
  @IsOptional()
  status: StatusMode = StatusMode.VISIBLE;

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
  @IsInt()
  illust_id?: number;

  @IsOptional()
  @IsBoolean()
  random_mode?: boolean;
}
