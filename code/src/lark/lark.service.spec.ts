import { Test, TestingModule } from '@nestjs/testing';
import { LarkService } from './lark.service';

describe('LarkService', () => {
  let service: LarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LarkService],
    }).compile();

    service = module.get<LarkService>(LarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
