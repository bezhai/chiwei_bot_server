import { PixivImage } from '../schemas/pixiv-image.schemas';

export class ImageUrl {
  show_url?: string;
  download_url?: string;
}

export type PixivImageWithUrl = PixivImage & ImageUrl;

export class ImageForLark {
  pixiv_addr: string;
}

export class UploadLarkResp {
  image_key?: string;
  width?: number;
  height?: number;
}
