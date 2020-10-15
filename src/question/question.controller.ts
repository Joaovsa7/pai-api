import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { ByUserDTO } from './question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private service: QuestionService){}

  @Get()
  findAll(): Promise<Question[] | []> {
    return this.service.findAll()
  }

  @Get('/:username')
  getByUser(@Param() params): Promise<ByUserDTO> {
    return this.service.byUser(params)
  }


  @Post('/delete/:id')
  deleteQuestion(@Param() params): Promise<string> {
    return this.service.delete(params.id)
  }

  @Post('/create')
  createQuestion(@Body() questionData: Question): Promise<Question> {
    return this.service.create(questionData)
  }
}