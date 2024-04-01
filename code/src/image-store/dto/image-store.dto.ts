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
}

export class UpdateStatusDto {
  @IsArray()
  @IsString({ each: true })
  pixiv_addr: string[];

  status: UpdateStatusMode;
}
