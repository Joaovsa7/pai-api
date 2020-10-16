import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'us-cdbr-east-02.cleardb.com',
      port: 3306,
      username: 'b6f1e99b2e776e',
      password: 'c947a246',
      database: 'heroku_61ca4d6e4c7490d',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    UsersModule,
    QuestionModule,
    AnswerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
