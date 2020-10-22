import { Body, Controller, Get, Param, Post, UseGuards, Query, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserExist } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService){}

  @UseGuards(JwtAuthGuard)
  @Get()
  filterUsername(@Query() query): Promise<User[] | []> {
    return this.usersService.getByUsernameQuery(query.username)
  }

  @HttpCode(200)
  @Post('/create')
  async createUser(@Body() userData: User) {
    const userCreated = await this.usersService.createUser(userData)
    return {
      message: `User: ${userData.username} was created with success`,
      ...userCreated,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:id')
  editUser(@Body() userData: Partial<User>, @Param('id') id: string) {
    return this.usersService.editUser(userData, parseInt(id))
  }

  @Post('/exist')
  userExist(@Body() params: UserExist): Promise<boolean> {
    return this.usersService.userExist(params)
  }

}