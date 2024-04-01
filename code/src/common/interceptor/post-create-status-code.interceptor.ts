import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostCreateStatusCodeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        if (response.statusCode === HttpStatus.CREATED) {
          response.status(HttpStatus.OK);
        }
        return data;
      }),
    );
  }
}
