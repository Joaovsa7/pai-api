import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './user.controller'
import { UsersService } from './user.service';
import { Question } from 'src/question/question.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  exports: [TypeOrmModule],
  providers: [UsersService]
})

export class UsersModule {}
