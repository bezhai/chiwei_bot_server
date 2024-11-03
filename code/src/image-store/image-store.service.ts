import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { PixivImage } from './schemas/pixiv-image.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ProxyService } from 'src/proxy/proxy.service';
import * as dayjs from 'dayjs';
import { OssService } from 'src/database/oss/oss.service';
import { LarkService } from 'src/lark/lark.service';
import { resizeImage } from 'src/common/utils/image-resize.utils';
import {
  ListPixivImageDto,
  StatusMode,
  UpdateStatusDto,
} from './dto/image-store.dto';
import { PaginationResponse } from 'src/common/responses/pagination-response';
import {
  ImageForLark,
  ImageUrl,
  PixivImageWithUrl,
} from './responses/image-store.responses';

@Injectable()
export class ImageStoreService {
  constructor(
    @Inject('OSS_CLIENT_INTERNAL') private readonly innerOssService: OssService,
    @Inject('OSS_CLIENT_EXTERNAL') private readonly ossService: OssService,
    @InjectModel(PixivImage.name) private pixivImageModel: Model<PixivImage>,
    private readonly proxyService: ProxyService,
    private readonly larkService: LarkService,
  ) {}

  async updateStatus(updateStatusDto: UpdateStatusDto) {
    const update: UpdateQuery<PixivImage> = {};

    switch (updateStatusDto.status) {
      case StatusMode.DELETE:
        update.del_flag = true;
        break;
      case StatusMode.VISIBLE:
        update.visible = true;
        break;
      case StatusMode.NO_VISIBLE:
        update.visible = false;
        break;
    }

    const result = await this.pixivImageModel.updateMany(
      {
        pixiv_addr: { $in: updateStatusDto.pixiv_addr },
      },
      {
        $set: update,
      },
    );
    console.log(result);
  }

  async findAll(
    listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<PixivImage>> {
    const filters: Array<FilterQuery<PixivImage>> = [];

    if (listPixivImageDto.author && listPixivImageDto.author !== '') {
      filters.push({
        author: { $regex: listPixivImageDto.author, $options: 'i' },
      });
    }

    if (listPixivImageDto.illust_id && listPixivImageDto.illust_id > 0) {
      filters.push({
        illust_id: listPixivImageDto.illust_id,
      });
    }

    if (listPixivImageDto.tags) {
      listPixivImageDto.tags.forEach((tag) => {
        filters.push({
          multi_tags: {
            $elemMatch: { translation: { $regex: tag, $options: 'i' } },
          },
        });
      });
    }

    if (listPixivImageDto.author_id && listPixivImageDto.author_id !== '') {
      filters.push({
        author_id: { $regex: listPixivImageDto.author_id, $options: 'i' },
      });
    }

    switch (listPixivImageDto.status) {
      case StatusMode.VISIBLE:
        filters.push({ visible: true }, { del_flag: false });
        break;
      case StatusMode.NOT_DELETE:
        filters.push({ del_flag: false });
        break;
      case StatusMode.DELETE:
        filters.push({ del_flag: true });
        break;
      case StatusMode.ALL:
        break;
      case StatusMode.NO_VISIBLE:
        filters.push({ visible: false }, { del_flag: false });
        break;
    }

    if (listPixivImageDto.start_time) {
      filters.push({
        create_time: { $gte: listPixivImageDto.start_time },
      });
    }

    const query = this.pixivImageModel.find(
      filters.length ? { $and: filters } : {},
    );

    if (!listPixivImageDto.random_mode) {
      query
        .skip((listPixivImageDto.page - 1) * listPixivImageDto.page_size)
        .limit(listPixivImageDto.page_size)
        .sort({ create_time: -1 });
    }

    const [images, total] = await Promise.all([
      query.lean().exec(),
      this.pixivImageModel
        .countDocuments(filters.length ? { $and: filters } : {})
        .exec(),
    ]);

    if (listPixivImageDto.random_mode) {
      // 计算随机抽样的大小
      const sampleSize = Math.min(
        await this.pixivImageModel.countDocuments({ $and: filters }).exec(),
        listPixivImageDto.page_size,
      );
      // 构建聚合查询
      const aggregationPipeline = [
        { $match: { $and: filters } },
        { $sample: { size: sampleSize } },
      ];
      // 执行聚合查询
      const randomImages = await this.pixivImageModel
        .aggregate<PixivImage>(aggregationPipeline)
        .exec();
      return { data: randomImages, total };
    }

    return { data: images, total };
  }

  async findUrl(tosFileName: string): Promise<ImageUrl> {
    return {
      show_url: await this.ossService.getFileUrl(tosFileName),
      download_url: await this.ossService.getFileUrl(tosFileName, true),
    };
  }

  async findAllWithUrls(
    listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<PixivImageWithUrl>> {
    const paginationResponse = await this.findAll(listPixivImageDto);
    const imagesWithUrls = await Promise.all(
      paginationResponse.data.map(async (image) => {
        const urls = await this.findUrl(image.tos_file_name);
        return { ...image, ...urls };
      }),
    );
    return new PaginationResponse<PixivImageWithUrl>({
      ...paginationResponse,
      data: imagesWithUrls,
    });
  }

  async findAllForLark(
    listPixivImageDto: ListPixivImageDto,
  ): Promise<PaginationResponse<ImageForLark>> {
    const paginationResponse = await this.findAll(listPixivImageDto);
    const images = await Promise.all(
      paginationResponse.data.map(async (image) => {
        if (!!image.image_key) {
          return { ...image };
        }
        const uploadResp = await this.uploadImageToLark(image.pixiv_addr);
        return { ...image, ...uploadResp };
      }),
    );
    return new PaginationResponse<ImageForLark>({
      ...paginationResponse,
      data: images,
    });
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

    const result = await this.innerOssService.uploadFile(tosFileName, buffer);

    if (!result.res.status || result.res.status !== 200) {
      throw new HttpException('Failed to upload image to OSS', 500);
    }

    await this.pixivImageModel.create({
      pixiv_addr: fileName,
      tos_file_name: tosFileName,
      illust_id: Number(illustId),
    });
  }

  async uploadImageToLark(pixivAddr: string) {
    const imageInfo = await this.pixivImageModel.findOne({
      pixiv_addr: pixivAddr,
    });
    if (!imageInfo) {
      throw new HttpException('Image not found in mongodb', 400);
    }
    if (imageInfo.image_key && imageInfo.image_key !== '') {
      // 已经上传过，直接返回
      return;
    }
    if (imageInfo.tos_file_name === '') {
      // TOS 未上传
      return;
    }
    const imageFile = await this.innerOssService.getFile(
      imageInfo.tos_file_name,
    );
    if (!imageFile) {
      throw new HttpException('Image not found in tos', 400);
    }
    const { outFile, imgWidth, imgHeight } = await resizeImage(
      imageFile.content,
    );
    const imageKey = await this.larkService.uploadImage(outFile);
    await this.pixivImageModel.updateOne(
      { pixiv_addr: pixivAddr },
      { image_key: imageKey, width: imgWidth, height: imgHeight },
    );
    return { image_key: imageKey, width: imgWidth, height: imgHeight };
  }
}
