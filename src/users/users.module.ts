import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './user.controller'
import { UsersService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { Answer } from 'src/answer/answer.entity';
import { QuestionModule } from 'src/question/question.module'; 
import { QuestionService } from 'src/question/question.service';
@Module({
  imports: [
  TypeOrmModule.forFeature([User, Answer]),
  forwardRef(() => AuthModule),
  QuestionModule
  ],
  controllers: [UsersController],
  exports: [TypeOrmModule],
  providers: [UsersService, QuestionService]
})

export class UsersModule { }
