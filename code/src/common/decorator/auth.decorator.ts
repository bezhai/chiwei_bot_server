import { UseGuards } from '@nestjs/common';
import { ServerAuthGuard } from '../guard/server-auth.guard';

export function TokenAuth() {
  return UseGuards(ServerAuthGuard);
}
