import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(config: OSS.Options) {
    this.client = new OSS(config);
  }

  async uploadFile(fileName: string, file: any): Promise<OSS.PutObjectResult> {
    return this.client.put(fileName, file);
  }

  async getFile(fileName: string): Promise<OSS.GetObjectResult> {
    return this.client.get(fileName);
  }

  async deleteFile(fileName: string): Promise<OSS.DeleteResult> {
    return this.client.delete(fileName);
  }

  async getFileUrl(
    fileName: string,
    isForDownload: boolean = false,
  ): Promise<string> {
    const options: OSS.SignatureUrlOptions = { expires: 2 * 60 * 60 };
    const pixivAddr = fileName.split('/').pop();
    if (!pixivAddr) {
      return '';
    }
    const headerResponse = await this.client.head(fileName);
    const contentLength = Number(
      (headerResponse.res.headers as { 'content-length': string })[
        'content-length'
      ],
    );
    if (isForDownload) {
      options.response = {};
      options.response['content-disposition'] =
        `attachment; filename=${pixivAddr}`;
    } else if (contentLength < 1024 * 1024 * 20) {
      // 过大图片展示的时候无法加样式
      options.process = 'style/sort_image';
    }
    return this.client.signatureUrl(fileName, options);
  }
}
