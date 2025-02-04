import { HttpException, Injectable } from '@nestjs/common';
import * as lark from '@larksuiteoapi/node-sdk';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
import { Readable } from 'stream';
import { streamToBuffer } from '../common/utils/stream.utils';

@Injectable()
export class LarkService {
  private readonly larkClient: lark.Client;

  constructor(private readonly configService: ConfigService) {
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
          image: Readable.from(file) as ReadStream,
        },
      });
      return response?.image_key || '';
    } catch (error) {
      console.error('Error stack:', error.stack);
      throw new HttpException('upload img fail', 500);
    }
  }

  async downloadImage(messageId: string, fileKey: string): Promise<Buffer> {
    try {
      const response = await this.larkClient.im.v1.messageResource.get({
        path: {
          message_id: messageId,
          file_key: fileKey,
        },
        params: {
          type: 'image',
        },
      });

      if (!response) {
        throw new HttpException('Failed to get image from Lark', 400);
      }

      const stream = response.getReadableStream();
      return await streamToBuffer(stream);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new HttpException('Failed to download image from Lark', 500);
    }
  }
}
