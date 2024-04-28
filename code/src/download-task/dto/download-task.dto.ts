export class CreateDownloadTaskDto {
  illust_id: string;
}

export class PaginationQueryDownloadTaskDto {
  constructor(
    public page: number = 1,
    public page_size: number = 10,
  ) {}

  get skip(): number {
    return (this.page - 1) * this.page_size;
  }
}
