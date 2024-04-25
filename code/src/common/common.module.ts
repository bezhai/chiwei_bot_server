import { Module } from '@nestjs/common';
import { ServerAuthGuard } from './guard/server-auth.guard';

@Module({
  providers: [ServerAuthGuard],
})
export class CommonModule {}
