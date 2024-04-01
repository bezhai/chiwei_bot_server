import { Test, TestingModule } from '@nestjs/testing';
import { ImageStoreService } from './image-store.service';

describe('ImageStoreService', () => {
  let service: ImageStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageStoreService],
    }).compile();

    service = module.get<ImageStoreService>(ImageStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
