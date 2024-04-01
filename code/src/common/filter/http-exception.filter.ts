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

    if (exception.message === 'Token has expired') {
      // 令牌过期需要单独判断
      response.status(exception.getStatus()).json({
        code: ErrorCode.USER_TOKEN_EXPIRED,
        msg: 'Token is expired',
      });
    } else {
      response.status(exception.getStatus()).json({
        code: ErrorCode.UNAUTHORIZED,
        msg: exception.message || 'Unauthorized',
      });
    }
  }
}
