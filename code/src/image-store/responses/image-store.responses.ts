import { PixivImage } from '../schemas/pixiv-image.schemas';

export class ImageUrl {
  show_url?: string;
  download_url?: string;
}

export type PixivImageWithUrl = PixivImage & ImageUrl;

export class ImageForLark {
  pixiv_addr: string;
}

// media-sync-worker 用 tos_file_name 记录图片存在哪个 OSS key，字段名是双方的契约。
export class DownloadImageResp {
  tos_file_name: string;
}

export class UploadLarkResp {
  image_key?: string;
  width?: number;
  height?: number;
}
