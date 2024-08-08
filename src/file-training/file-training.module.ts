import { Module } from '@nestjs/common';
import { FileTrainingService } from './file-training.service';

@Module({
  providers: [FileTrainingService]
})
export class FileTrainingModule {}
