import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserExist } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService){}

  @Get()
  findAll(): Promise<User[] | []> {
    return this.usersService.findAll()
  }

  @Post('/exist')
  userExist(@Body() username: UserExist): Promise<boolean> {
    return this.usersService.usernameExist(username)
  }

  @Post('/create')
  createUser(@Body() userData: User): Promise<User> {
    return this.usersService.createUser(userData)
  }
}