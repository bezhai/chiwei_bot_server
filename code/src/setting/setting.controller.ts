import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingDto, SettingListDto } from './dto/setting.dto';
import { WrapResponse } from 'src/common/decorator/wrap-response.decorator';
import { JwtGuard } from 'src/common/decorator/jwt.decorator';

@JwtGuard()
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @WrapResponse('value')
  async getSetting(@Query('key') key: string) {
    return await this.settingService.get(key);
  }

  @Post()
  async setSetting(@Body() req: SettingDto) {
    await this.settingService.set(req.key, req.value);
  }

  @Get('array')
  @WrapResponse('value')
  async getArraySetting(@Query('key') key: string) {
    return await this.settingService.smember(key);
  }

  @Post('array')
  async setArraySetting(@Body() req: SettingListDto) {
    await this.settingService.array_set(req.key, req.value);
  }
}
