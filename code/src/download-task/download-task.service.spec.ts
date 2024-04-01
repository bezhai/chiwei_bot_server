import { Test, TestingModule } from '@nestjs/testing';
import { DownloadTaskService } from './download-task.service';

describe('DownloadTaskService', () => {
  let service: DownloadTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadTaskService],
    }).compile();

    service = module.get<DownloadTaskService>(DownloadTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
