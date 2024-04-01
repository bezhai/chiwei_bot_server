import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';

export function JwtGuard() {
  return UseGuards(JwtAuthGuard);
}
