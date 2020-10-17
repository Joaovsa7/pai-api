import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { ByUserDTO } from './question.dto';
import { ApiResponseModel } from 'src/shared/apiResponseModel/apiResponseModel';

@Controller('questions')
export class QuestionController {
  constructor(private service: QuestionService){}

  @Get()
  getAll(): Promise<ApiResponseModel<Question[]>> {
    return this.service.getAll()
  }

  @Get('/:username')
  getByUser(@Param() params): Promise<ApiResponseModel<ByUserDTO>> {
    return this.service.byUser(params)
  }


  @Post('/delete/:id')
  deleteQuestion(@Param() params): Promise<ApiResponseModel<Question>> {
    return this.service.delete(params.id)
  }

  @Post('/create')
  createQuestion(@Body() questionData: Question): Promise<ApiResponseModel<Question>> {
    return this.service.create(questionData)
  }
}