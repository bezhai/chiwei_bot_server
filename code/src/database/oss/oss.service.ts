import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(config: OSS.Options) {
    this.client = new OSS(config);
  }

  async uploadFile(file: any): Promise<any> {
    const result = await this.client.put(file.name, file.data);
    return result;
  }

  // 其他需要的OSS操作方法...
}
