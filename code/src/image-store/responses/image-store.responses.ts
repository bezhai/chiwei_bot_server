import { PixivImage } from '../schemas/pixiv-image.schemas';

export class ImageUrl {
  show_url?: string;
  download_url?: string;
}

export type PixivImageWithUrl = PixivImage & ImageUrl;

export class ImageForLark {
  image_key?: string;
  pixiv_addr: string;
  width?: number;
  height?: number;
}
