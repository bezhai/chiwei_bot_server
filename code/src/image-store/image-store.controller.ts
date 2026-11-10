import { Controller, Post, Body } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { DownloadImageDto } from './dto/download-image.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';
import { DownloadImageResp } from './responses/image-store.responses';

@Controller('/image-store')
export class ImageStoreController {
  constructor(private readonly imageStoreService: ImageStoreService) {}

  @TokenAuth()
  @Post('/download')
  async downloadImage(
    @Body() downloadImageDto: DownloadImageDto,
  ): Promise<DownloadImageResp> {
    return this.imageStoreService.downloadImage(
      downloadImageDto.pixiv_url,
      downloadImageDto.pixiv_auth,
    );
  }
}
