import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from './answer.entity';
import { toAnswerDTO } from './answer.dto';
import { ApiResponseModel } from 'src/shared/apiResponseModel/apiResponseModel';

@Controller('answer')
export class AnswerController {
  constructor(private service: AnswerService){}

  @Get()
  async findAll(): Promise<ApiResponseModel<Answer[]>> {
    return this.service.findAll()
  }

  @Post('/create')
  submitAnswer(@Body() questionData: toAnswerDTO): Promise<ApiResponseModel<Answer>> {
    return this.service.toAnswer(questionData)
  }
}