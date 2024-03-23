import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const responseKey = this.reflector.get<string>(
          'responseKey',
          context.getHandler(),
        );
        if (responseKey && data) {
          data = { [responseKey]: data };
        }
        return {
          code: 0,
          msg: 'success',
          data: data,
        };
      }),
    );
  }
}
