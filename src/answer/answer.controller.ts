import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from './answer.entity';
import { toAnswerDTO } from './answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private service: AnswerService){}

  @Get()
  async getAllAnswers(): Promise<Answer[]> {
    return this.service.getAll()
  }

  @Post('/create')
  submitAnswer(@Body() questionData: toAnswerDTO) {
    return this.service.toAnswer(questionData)
  }
}