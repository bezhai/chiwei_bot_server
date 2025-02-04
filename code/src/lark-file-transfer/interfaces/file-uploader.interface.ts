import { Buffer } from 'buffer';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

export interface UploadResponse {
  code: number;
  data: string;
  message: string;
}

export interface FileUploader {
  upload(fileBuffer: Buffer, filename: string): Promise<UploadResponse>;
}

export class AI302Uploader implements FileUploader {
  private readonly API_URL = 'https://api.302.ai/302/upload-file';
  private readonly bearerToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const token = configService.get<string>('AI302_BEARER_TOKEN');
    if (!token) {
      throw new Error('AI302_BEARER_TOKEN environment variable is required');
    }
    this.bearerToken = token;
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename,
      contentType: 'application/octet-stream',
    });

    const response = await this.httpService
      .post(this.API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.bearerToken}`,
        },
      })
      .toPromise();

    if (!response?.data?.data) {
      throw new Error('Upload failed: No response data');
    }

    return {
      code: response.data.code,
      data: response.data.data,
      message: response.data.message,
    };
  }
}
