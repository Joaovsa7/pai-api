import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private service: QuestionService){}

  @Get()
  getAll(): Promise<Question[]> {
    return this.service.getAll()
  }

  @Get('/:username')
  getByUser(@Param() params): Promise<Question[]> {
    return this.service.byUser(params.username)
  }


  @Post('/delete/:id')
  deleteQuestion(@Param() params): Promise<Question> {
    return this.service.delete(params.id)
  }

  @Post('/create')
  createQuestion(@Body() questionData: Question): Promise<Question> {
    return this.service.create(questionData)
  }
}