import { Test, TestingModule } from '@nestjs/testing';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';

describe('TranslationController', () => {
  let controller: TranslationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationController],
      providers: [TranslationService],
    }).compile();

    controller = module.get<TranslationController>(TranslationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
