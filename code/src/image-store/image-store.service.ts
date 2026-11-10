import { HttpException, Injectable } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { PixivAuth } from 'src/proxy/dto/proxy-request.dto';
import * as dayjs from 'dayjs';
import { OssService } from 'src/oss/oss.service';
import { DownloadImageResp } from './responses/image-store.responses';

@Injectable()
export class ImageStoreService {
  constructor(
    private readonly ossService: OssService,
    private readonly proxyService: ProxyService,
  ) {}

  // 不查重：调用方（media-sync-worker）调用前已经按自己的图片目录去重，
  // 这里每次都下载、上传，并返回实际写入的 key。
  async downloadImage(
    pixivUrl: string,
    pixivAuth: PixivAuth,
  ): Promise<DownloadImageResp> {
    const fileName = pixivUrl.split('/').pop();
    if (!fileName) {
      throw new HttpException('Invalid pixiv URL', 400);
    }
    const illustId = fileName.split('_').shift();
    if (!illustId) {
      throw new HttpException('Invalid illust ID', 400);
    }

    const buffer = await this.proxyService.proxyRequestBuffer({
      url: pixivUrl,
      referer: `https://www.pixiv.net/artworks/${illustId}`,
      pixiv_auth: pixivAuth,
    });

    const tosFileName = `pixiv_img_v2/${dayjs().format('YYYYMMDD')}/${fileName}`;

    const result = await this.ossService.uploadFile(tosFileName, buffer);

    if (!result.res.status || result.res.status !== 200) {
      throw new HttpException('Failed to upload image to OSS', 500);
    }

    return { tos_file_name: tosFileName };
  }
}
