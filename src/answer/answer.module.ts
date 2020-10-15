import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnswerController } from './answer.controller'
import { AnswerService } from './answer.service'
import { Answer } from './answer.entity'
import { User } from 'src/users/user.entity';
import { Question } from 'src/question/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, User, Question])],
  controllers: [AnswerController],
  exports: [TypeOrmModule],
  providers: [AnswerService]
})

export class AnswerModule {}
