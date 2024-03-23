import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '../consts/error-codes';

@Catch(UnauthorizedException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      code: ErrorCode.UNAUTHORIZED,
      msg: exception.message || 'Unauthorized',
    });
  }
}
