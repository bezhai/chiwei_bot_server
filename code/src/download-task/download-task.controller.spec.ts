import { Test, TestingModule } from '@nestjs/testing';
import { DownloadTaskController } from './download-task.controller';
import { DownloadTaskService } from './download-task.service';

describe('DownloadTaskController', () => {
  let controller: DownloadTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadTaskController],
      providers: [DownloadTaskService],
    }).compile();

    controller = module.get<DownloadTaskController>(DownloadTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
