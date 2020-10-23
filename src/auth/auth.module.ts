import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/user.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { QuestionModule } from 'src/question/question.module';
import { QuestionService } from 'src/question/question.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    forwardRef(() => QuestionModule)
  ],
  providers: [AuthService, UsersService, QuestionService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
