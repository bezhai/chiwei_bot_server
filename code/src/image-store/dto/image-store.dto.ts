import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export enum StatusMode {
  NOT_DELETE = 0,
  VISIBLE = 1,
  DELETE = 2,
  ALL = 3,
  NO_VISIBLE = 4,
}

export type UpdateStatusMode =
  | StatusMode.DELETE
  | StatusMode.VISIBLE
  | StatusMode.NO_VISIBLE;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag_and_author?: string[];

  @IsEnum(StatusMode)
  @IsOptional()
  @Type(() => Number)
  status: StatusMode = StatusMode.VISIBLE;

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
  @IsInt()
  @Type(() => Number)
  illust_id?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  random_mode?: boolean;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'start_time must be a valid Unix timestamp (in milliseconds)',
    },
  )
  start_time?: number;

  @IsOptional()
  @IsArray()
  pixiv_addrs?: string[];
}

export class UpdateStatusDto {
  @IsArray()
  @IsString({ each: true })
  pixiv_addr: string[];

  status: UpdateStatusMode;
}
