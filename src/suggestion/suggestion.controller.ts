import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuccessResponse } from 'src/shared/responses';

@Controller('suggestion')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Get()
  async getAllSuggestions() {
    return new SuccessResponse(await this.suggestionService.getAllSuggestions()).setStatusCode(HttpStatus.OK);
  }

  @Post()
  async uploadSuggestion(@Body('question') question: string) {
    return new SuccessResponse(await this.suggestionService.uploadSuggestion(question))
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Tạo gợi ý thành công');
  }

  @Delete(':id')
  async deleteSuggestion(@Param('id') id: string) {
    return new SuccessResponse(await this.suggestionService.deleteSuggestion(id))
      .setStatusCode(HttpStatus.OK)
      .setMessage('Xóa gợi ý thành công');
  }
}
