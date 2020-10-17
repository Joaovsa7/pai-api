import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  private async validatePassword(hashedPassword: string, password: string) {
    const isPasswordMatching = await bcrypt.compare(
      password,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  private _createToken(user: Partial<User>): any {
    const accessToken = this.jwtService.sign({ username: user.username, id: user.id })
    return {
        expiresIn: jwtConstants.expiresIn,
        accessToken,    
    };  
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getByUsername(username);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    await this.validatePassword(hashedPassword, pass)
    return user;
  }

  async login(user: any) {
    const userData = await this.validateUser(user.username, user.password)
    const token = await this._createToken(userData)
    return {
      user: userData,
      ...token
    };
  }

  validatePayload(payload: any) {
    return this.usersService.getByPayload(payload)
  }
}