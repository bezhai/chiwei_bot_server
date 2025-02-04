import { Injectable, HttpException } from '@nestjs/common';
import { LarkService } from '../lark/lark.service';
import {
  FileUploader,
  AI302Uploader,
} from './interfaces/file-uploader.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileTransferCache } from './entities/file-transfer-cache.entity';

@Injectable()
export class LarkFileTransferService {
  constructor(
    private readonly larkService: LarkService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(FileTransferCache)
    private readonly cacheRepository: Repository<FileTransferCache>,
  ) {}

  private getUploader(destination: string): FileUploader {
    switch (destination) {
      case '302ai':
        return new AI302Uploader(this.configService, this.httpService);
      default:
        throw new HttpException(`Unsupported destination: ${destination}`, 400);
    }
  }

  async transferFile(messageId: string, fileKey: string, destination: string) {
    try {
      // Check cache first
      const cachedResult = await this.cacheRepository.findOne({
        where: {
          messageId,
          fileKey,
          destination,
        },
      });

      if (cachedResult) {
        return cachedResult.url;
      }

      // Get image data from Lark
      const imageBuffer = await this.larkService.downloadImage(
        messageId,
        fileKey,
      );

      // Get uploader for the specified destination
      const uploader = this.getUploader(destination);

      // Upload to destination
      const result = await uploader.upload(imageBuffer, `lark_${fileKey}`);

      // Extract URL from response and save to cache
      if (result?.data) {
        const url = result.data;
        const cacheEntry = this.cacheRepository.create({
          messageId,
          fileKey,
          destination,
          url,
        });
        await this.cacheRepository.save(cacheEntry);
        return url;
      }

      throw new HttpException('Failed to get URL from upload response', 500);
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        `Failed to process image: ${error.message}`,
        error.status || 500,
      );
    }
  }
}
