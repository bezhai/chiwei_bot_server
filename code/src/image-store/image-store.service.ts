import { Injectable } from '@nestjs/common';
import { CreateImageStoreDto } from './dto/create-image-store.dto';
import { UpdateImageStoreDto } from './dto/update-image-store.dto';

@Injectable()
export class ImageStoreService {
  create(createImageStoreDto: CreateImageStoreDto) {
    return 'This action adds a new imageStore';
  }

  findAll() {
    return `This action returns all imageStore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageStore`;
  }

  update(id: number, updateImageStoreDto: UpdateImageStoreDto) {
    return `This action updates a #${id} imageStore`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageStore`;
  }
}
