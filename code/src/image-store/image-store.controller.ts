import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { DownloadImageDto } from './dto/download-image.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';
import { UploadImageToLarkDto } from './dto/upload-image.dto';
import { ListPixivImageDto, UpdateStatusDto } from './dto/image-store.dto';
import { PaginationResponse } from 'src/common/responses/pagination-response';
import {
  ImageForLark,
  PixivImageWithUrl,
  UploadLarkResp,
} from './responses/image-store.responses';
import { JwtGuard } from 'src/common/decorator/jwt.decorator';

@Controller('/image-store')
export class ImageStoreController {
  constructor(private readonly imageStoreService: ImageStoreService) {}

  @JwtGuard()
  @Get()
  findAll(
    @Query()
    listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<PixivImageWithUrl>> {
    return this.imageStoreService.findAllWithUrls(listPixivImageDto);
  }

  @JwtGuard()
  @Post('/update-status')
  async updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
    return this.imageStoreService.updateStatus(updateStatusDto);
  }

  @TokenAuth()
  @Post('/download')
  async downloadImage(@Body() downloadImageDto: DownloadImageDto) {
    return this.imageStoreService.downloadImage(downloadImageDto.pixiv_url);
  }

  @TokenAuth()
  @Post('/upload-lark')
  async uploadImageToLark(
    @Body() uploadImageToLarkDto: UploadImageToLarkDto,
  ): Promise<UploadLarkResp | undefined> {
    return this.imageStoreService.uploadImageToLark(
      uploadImageToLarkDto.pixiv_addr,
    );
  }

  @TokenAuth()
  @Post('/token-auth-list')
  findAllWithTokenAuth(
    @Body()
    listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<ImageForLark>> {
    return this.imageStoreService.findAllSimple(listPixivImageDto);
  }
}
