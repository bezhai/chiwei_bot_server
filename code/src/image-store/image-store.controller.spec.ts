import { Test, TestingModule } from '@nestjs/testing';
import { ImageStoreController } from './image-store.controller';
import { ImageStoreService } from './image-store.service';

describe('ImageStoreController', () => {
  let controller: ImageStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageStoreController],
      providers: [ImageStoreService],
    }).compile();

    controller = module.get<ImageStoreController>(ImageStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
