import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserExist } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService){}

  @Post('/exist')
  userExist(@Body() params: UserExist): Promise<boolean> {
    return this.usersService.userExist(params)
  }

  @Post('/create')
  createUser(@Body() userData: User) {
    return this.usersService.createUser(userData)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:id')
  editUser(@Body() userData: Partial<User>, @Param('id') id: string) {
    return this.usersService.editUser(userData, parseInt(id))
  }
}