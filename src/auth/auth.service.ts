import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) { }

  private async validatePassword(hashedPassword: string, password: string) {
    const isPasswordMatching = await bcrypt.compare(
      password,
      hashedPassword
    );
  
    if (isPasswordMatching === false) {
      console.log({ isPasswordMatching, password, hashedPassword })
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
    return;
  }

  public createToken(user: Partial<User>): any {
    const accessToken = this.jwtService.sign({ username: user.email, id: user.id })
    return {
      expiresIn: jwtConstants.expiresIn,
      accessToken,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new HttpException('Wrong credentials provided', HttpStatus.NOT_FOUND);
    }

    await this.validatePassword(user.password, pass)
    return user;
  }

  async login(user: any) {
    const token = await this.createToken(user)
    user.password = null;
    return {
      user,
      ...token
    };
  }

  validatePayload(payload: any) {
    return this.usersService.getByPayload(payload)
  }
}
