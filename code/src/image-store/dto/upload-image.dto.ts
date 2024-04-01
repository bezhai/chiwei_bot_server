import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageToLarkDto {
  @IsString()
  @IsNotEmpty()
  pixiv_addr: string;
}
