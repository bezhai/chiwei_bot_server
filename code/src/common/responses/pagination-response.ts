export class PaginationResponse<T> {
  total: number;
  page: number;
  page_size: number;
  data: T[];

  constructor(partial: Partial<PaginationResponse<T>>) {
    Object.assign(this, partial);
  }
}
