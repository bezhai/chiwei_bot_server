import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
