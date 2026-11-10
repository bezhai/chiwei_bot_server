import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PixivAuth } from 'src/proxy/dto/proxy-request.dto';

export class DownloadImageDto {
  @IsString()
  @IsNotEmpty()
  pixiv_url: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => PixivAuth)
  pixiv_auth: PixivAuth;
}
