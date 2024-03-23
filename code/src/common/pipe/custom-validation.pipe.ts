import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ErrorCode } from '../consts/error-codes';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        const messages = errors.reduce((acc, error) => {
          if (error.constraints) {
            // 如果有违反的约束，则将它们的错误消息添加到数组中
            Object.values(error.constraints).forEach((message) => {
              acc.push(message);
            });
          } else if (error.children && error.children.length > 0) {
            // 如果没有违反的约束，但有子验证错误，则递归处理子验证错误
            const childrenMessages = error.children.map((childError) => {
              return `Validation failed for property "${childError.property}"`;
            });
            acc.push(...childrenMessages);
          }
          return acc;
        }, [] as string[]);

        return new BadRequestException({
          code: ErrorCode.VALIDATION_FAILED,
          msg: messages.join(', '),
        });
      },
    });
  }
}
