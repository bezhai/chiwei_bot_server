export interface Upload {
  key: string;
  content: Buffer;
}

// 和 ali-oss 的 put 一致：成功时返回 { name, url, res }，res.status 是 OSS 返回的 HTTP 状态码。
export class FakeOss {
  readonly uploads: Upload[] = [];

  async uploadFile(key: string, content: Buffer) {
    this.uploads.push({ key, content });
    return {
      name: key,
      url: `https://dummy-bucket.oss-cn-hongkong.aliyuncs.com/${key}`,
      res: { status: 200 },
    };
  }
}
