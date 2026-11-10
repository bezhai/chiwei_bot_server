import { createServer, IncomingHttpHeaders, Server } from 'http';
import { AddressInfo } from 'net';

export interface ReceivedRequest {
  path: string;
  headers: IncomingHttpHeaders;
}

// 本地 HTTP server 扮演 pixiv：server 用真实的 axios 发请求，这里记下 pixiv 实际收到的路径和请求头。
export class FakePixivServer {
  readonly received: ReceivedRequest[] = [];
  private readonly server: Server;

  constructor(body: string | Buffer, contentType: string) {
    this.server = createServer((req, res) => {
      this.received.push({ path: req.url ?? '', headers: req.headers });
      // 带 content-length：ProxyController 会把上游响应头原样抄到自己的响应上，
      // 上游如果是 chunked，再加上 express 自己算的 content-length，响应就不合法了。
      res.writeHead(200, {
        'content-type': contentType,
        'content-length': Buffer.byteLength(body),
      });
      res.end(body);
    });
  }

  // 返回 base URL，例如 http://127.0.0.1:12345
  async start(): Promise<string> {
    await new Promise<void>((resolve) =>
      this.server.listen(0, '127.0.0.1', resolve),
    );
    const { port } = this.server.address() as AddressInfo;
    return `http://127.0.0.1:${port}`;
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) =>
      this.server.close((err) => (err ? reject(err) : resolve())),
    );
  }
}
