import { PartialType } from '@nestjs/mapped-types';
import { CreateImageStoreDto } from './create-image-store.dto';

export class UpdateImageStoreDto extends PartialType(CreateImageStoreDto) {}
