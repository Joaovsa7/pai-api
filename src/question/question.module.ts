import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { Question } from './question.entity'
import { User } from 'src/users/user.entity';
import { Answer } from 'src/answer/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Answer])],
  controllers: [QuestionController],
  exports: [TypeOrmModule],
  providers: [QuestionService]
})

export class QuestionModule {}
