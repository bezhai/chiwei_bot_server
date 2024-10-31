export class ProxyRequestDto {
  url: string;
  referer: string;
  headers?: { [key: string]: string };
  debug?: boolean;
}
