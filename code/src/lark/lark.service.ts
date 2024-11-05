import { HttpException, Injectable } from '@nestjs/common';
import * as lark from '@larksuiteoapi/node-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LarkService {
  private readonly larkClient: lark.Client;

  constructor(configService: ConfigService) {
    this.larkClient = new lark.Client({
      appId: configService.get<string>('LARK_APP_ID') || '',
      appSecret: configService.get<string>('LARK_APP_SECRET') || '',
    });
  }

  async uploadImage(file: Buffer): Promise<string> {
    try {
      const response = await this.larkClient.im.image.create({
        data: {
          image_type: 'message',
          image: file,
        },
      });
      return response?.image_key || '';
    } catch (error) {
      console.error('Error stack:', error.stack);
      throw new HttpException('upload img fail', 500);
    }
  }
}
