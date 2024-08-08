import { Test, TestingModule } from '@nestjs/testing';
import { FileTrainingService } from './file-training.service';

describe('FileTrainingService', () => {
  let service: FileTrainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileTrainingService],
    }).compile();

    service = module.get<FileTrainingService>(FileTrainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
