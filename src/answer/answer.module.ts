import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnswerController } from './answer.controller'
import { AnswerService } from './answer.service'
import { Answer } from './answer.entity'
import { User } from 'src/users/user.entity';
import { QuestionService } from 'src/question/question.service';
import { QuestionModule } from 'src/question/question.module';
import { Question } from 'src/question/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, User, Question])],
  controllers: [AnswerController],
  exports: [TypeOrmModule],
  providers: [AnswerService, QuestionService]
})

export class AnswerModule {}
