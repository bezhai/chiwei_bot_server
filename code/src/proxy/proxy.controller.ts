import {
  Controller,
  Res,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Response } from 'express';
import { ProxyRequestDto } from './dto/proxy-request.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';

@TokenAuth()
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async proxy(@Body() proxyRequestDto: ProxyRequestDto, @Res() res: Response) {
    try {
      const { body, headers } =
        await this.proxyService.proxyRequest(proxyRequestDto);
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value as string | string[]);
      });
      res.send(body);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
