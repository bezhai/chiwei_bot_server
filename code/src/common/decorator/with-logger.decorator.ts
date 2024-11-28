import { Logger } from '@nestjs/common';

export function WithLogger(context?: string): ClassDecorator {
  return (target) => {
    Object.defineProperty(target.prototype, 'logger', {
      value: new Logger(context || target.name),
      writable: false,
    });
  };
}
