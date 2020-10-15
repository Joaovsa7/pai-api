import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from './answer.entity';
import { toAnswerDTO } from './answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private service: AnswerService){}

  @Get()
  findAll(): Promise<Answer[]> {
    return this.service.findAll()
  }

  @Post('/create')
  submitAnswer(@Body() questionData: toAnswerDTO): Promise<Answer> {
    return this.service.toAnswer(questionData)
  }
}