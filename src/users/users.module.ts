import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './user.controller'
import { UsersService } from './user.service';
import { Question } from 'src/question/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question])],
  controllers: [UsersController],
  exports: [TypeOrmModule],
  providers: [UsersService]
})

export class UsersModule {}
