import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class SuggestionService {
  constructor(private readonly httpService: HttpService) {}

  async getAllSuggestions() {
    const res = await firstValueFrom(
      this.httpService.get('/suggestion/getAllSuggestion').pipe(
        catchError((err) => {
          throw new BadRequestException('Lỗi khi lấy dữ liệu từ server');
        })
      )
    );
    return res.data.suggestion;
  }

  async uploadSuggestion(question: string) {
    const res = await firstValueFrom(
      this.httpService
        .post('/suggestion/suggestionUpload', undefined, {
          params: {
            question
          }
        })
        .pipe(
          catchError((err) => {
            throw new BadRequestException('Lỗi khi gửi dữ liệu lên server');
          })
        )
    );
    return res.data;
  }

  async deleteSuggestion(id: string) {
    const res = await firstValueFrom(
      this.httpService
        .delete('/suggestion/deleteSuggestion', {
          params: {
            field: id
          }
        })
        .pipe(
          catchError((err) => {
            throw new BadRequestException('Lỗi khi xóa dữ liệu');
          })
        )
    );
    return res.data;
  }
}
