import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateImageStoreDto } from './dto/create-image-store.dto';
import { UpdateImageStoreDto } from './dto/update-image-store.dto';
import OSS from 'ali-oss';
import { Model } from 'mongoose';
import { PixivImage } from './schemas/pixiv-image.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ProxyService } from 'src/proxy/proxy.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ImageStoreService {
  constructor(
    @Inject('OSS_CLIENT_EXTERNAL') private readonly ossClient: OSS,
    @InjectModel(PixivImage.name) private pixivImageModel: Model<PixivImage>,
    private readonly proxyService: ProxyService,
  ) {}
  create(createImageStoreDto: CreateImageStoreDto) {
    return `This action adds a new imageStore, ${createImageStoreDto.illust_id}`;
  }

  findAll() {
    return `This action returns all imageStore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageStore`;
  }

  update(id: number, updateImageStoreDto: UpdateImageStoreDto) {
    return `This action updates a #${id} imageStore, ${updateImageStoreDto.illust_id}`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageStore`;
  }

  async downloadImage(pixivUrl: string) {
    const fileName = pixivUrl.split('/').pop();
    if (!fileName) {
      throw new HttpException('Invalid pixiv URL', 400);
    }
    const illustId = fileName.split('_').shift();
    if (!illustId) {
      throw new HttpException('Invalid illust ID', 400);
    }

    const count = await this.pixivImageModel.countDocuments({
      pixiv_addr: fileName,
      tos_file_name: { $ne: '' },
    });
    if (count > 0) {
      return;
    }

    const buffer = await this.proxyService.proxyRequestBuffer({
      url: pixivUrl,
      referer: `https://www.pixiv.net/artworks/${illustId}`,
    });

    const tosFileName = `pixiv_img_v2/${dayjs().format('YYYYMMDD')}/${fileName}`;

    const result = await this.ossClient.put(tosFileName, buffer);

    if (!result.res.status || result.res.status !== 200) {
      throw new HttpException('Failed to upload image to OSS', 500);
    }

    await this.pixivImageModel.create({
      pixiv_addr: fileName,
      tos_file_name: tosFileName,
      illust_id: Number(illustId),
    });
  }
}
