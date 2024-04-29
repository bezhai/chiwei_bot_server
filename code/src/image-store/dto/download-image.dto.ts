import { IsNotEmpty, IsString } from 'class-validator';

export class DownloadImageDto {
  @IsString()
  @IsNotEmpty()
  pixiv_url: string;
}
