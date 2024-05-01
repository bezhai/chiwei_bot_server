import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { CreateImageStoreDto } from './dto/create-image-store.dto';
import { UpdateImageStoreDto } from './dto/update-image-store.dto';
import { DownloadImageDto } from './dto/download-image.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';
import { UploadImageToLarkDto } from './dto/upload-image.dto';
import { ListPixivImageDto } from './dto/image-store.dto';
import { PaginationResponse } from 'src/common/responses/pagination-response';
import { PixivImageWithUrl } from './responses/image-store.responses';
import { JwtGuard } from 'src/common/decorator/jwt.decorator';

@Controller('/image-store')
export class ImageStoreController {
  constructor(private readonly imageStoreService: ImageStoreService) {}

  @TokenAuth()
  @Post()
  create(@Body() createImageStoreDto: CreateImageStoreDto) {
    return this.imageStoreService.create(createImageStoreDto);
  }

  @JwtGuard()
  @Get()
  findAll(
    @Query() listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<PixivImageWithUrl>> {
    return this.imageStoreService.findAllWithUrls(listPixivImageDto);
  }

  @TokenAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageStoreService.findOne(+id);
  }

  @TokenAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageStoreDto: UpdateImageStoreDto,
  ) {
    return this.imageStoreService.update(+id, updateImageStoreDto);
  }

  @TokenAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageStoreService.remove(+id);
  }

  @TokenAuth()
  @Post('/download')
  async downloadImage(@Body() downloadImageDto: DownloadImageDto) {
    return this.imageStoreService.downloadImage(downloadImageDto.pixiv_url);
  }

  @TokenAuth()
  @Post('/upload-lark')
  async uploadImageToLark(@Body() uploadImageToLarkDto: UploadImageToLarkDto) {
    return this.imageStoreService.uploadImageToLark(
      uploadImageToLarkDto.pixiv_addr,
    );
  }
}
