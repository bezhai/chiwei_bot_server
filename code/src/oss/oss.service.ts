import * as OSS from 'ali-oss';

export class OssService {
  private client: OSS;

  constructor(config: OSS.Options) {
    this.client = new OSS(config);
  }

  async uploadFile(fileName: string, file: any): Promise<OSS.PutObjectResult> {
    return this.client.put(fileName, file);
  }
}
