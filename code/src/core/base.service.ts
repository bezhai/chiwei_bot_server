import { Logger } from '@nestjs/common';

export class BaseService {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }
}
