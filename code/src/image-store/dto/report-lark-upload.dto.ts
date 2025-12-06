import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReportLarkUploadDto {
  @IsString()
  @IsNotEmpty()
  pixiv_addr: string;

  @IsString()
  @IsNotEmpty()
  image_key: string;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;
}
