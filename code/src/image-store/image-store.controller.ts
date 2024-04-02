import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageStoreService } from './image-store.service';
import { CreateImageStoreDto } from './dto/create-image-store.dto';
import { UpdateImageStoreDto } from './dto/update-image-store.dto';

@Controller('image-store')
export class ImageStoreController {
  constructor(private readonly imageStoreService: ImageStoreService) {}

  @Post()
  create(@Body() createImageStoreDto: CreateImageStoreDto) {
    return this.imageStoreService.create(createImageStoreDto);
  }

  @Get()
  findAll() {
    return this.imageStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageStoreService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageStoreDto: UpdateImageStoreDto,
  ) {
    return this.imageStoreService.update(+id, updateImageStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageStoreService.remove(+id);
  }
}
