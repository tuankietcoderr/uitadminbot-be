import { Injectable } from '@nestjs/common';
import { CreateFileTraningDto } from './file-training.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileTrainingService {
  constructor(private readonly httpService: HttpService) {}

  async trainFile(data: CreateFileTraningDto[]) {
    return await firstValueFrom(
      this.httpService.post('/file/fileUpload', {
        data
      })
    );
  }

  async deleteFile(public_id: string) {
    return await firstValueFrom(
      this.httpService.delete('/file/fileDelete', {
        params: {
          public_id
        }
      })
    );
  }
}
