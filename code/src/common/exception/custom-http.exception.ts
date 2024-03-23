import { HttpException, HttpStatus } from '@nestjs/common';
export class CustomHttpException extends HttpException {
  private readonly errorCode: number;
  private readonly errorMessage: string;
  constructor(errorCode: number, errorMessage: string, statusCode: HttpStatus) {
    super(errorMessage, statusCode);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
  getErrorCode(): number {
    return this.errorCode;
  }
  getErrorMessage(): string {
    return this.errorMessage;
  }
  getResponse(): Record<string, any> {
    return {
      code: this.getErrorCode(),
      msg: this.getErrorMessage(),
    };
  }
}
