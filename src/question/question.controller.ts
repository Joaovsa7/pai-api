import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('questions')
export class QuestionController {
  constructor(private service: QuestionService){}

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  byUser(): Promise<Question[]> {
    return this.service.getAll()
  }

  @Get('/profile/:username')
  getByUser(@Param() params): Promise<Question[]> {
    return this.service.byUserForProfile(params.username)
  }


  @UseGuards(JwtAuthGuard)
  @Post('/delete/:id')
  deleteQuestion(@Param() params): Promise<Question> {
    return this.service.delete(params.id)
  }

  @Post('/create')
  createQuestion(@Body() questionData: Question): Promise<Question> {
    return this.service.create(questionData)
  }
}