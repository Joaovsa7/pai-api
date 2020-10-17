import { hash } from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { RegisterDTO, UserExist } from './user.dto';
import { User } from './user.entity';
import { ApiResponseModel } from 'src/shared/apiResponseModel/apiResponseModel';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  getByUsernameQuery(username: string): Promise<User[]> {
    return this.usersRepository.find({ where: { username: Like(`%${username}%`)}});
  }

  getByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email })
  }

  async _throwExceptionIfUsernameExist(username: string) {
    const userAlreadyExist = await this.usernameExist({ username })
    if (userAlreadyExist) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async usernameExist({ username }: UserExist): Promise<boolean> {
    const hasUser = await this.usersRepository.findOne({ username })
    return !!hasUser
  }


  getByPayload({ username }: any): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username }
    });
  }


  async createUser(data: User): Promise<ApiResponseModel<RegisterDTO>> {
    try {
      await this._throwExceptionIfUsernameExist(data.username)
      
      const hashedPassword = await hash(data.password, 10)
      const userData = this.usersRepository.create({ ...data, password: hashedPassword })
      const { username, email } = await this.usersRepository.save(userData)
      return {
        message: 'Success',
        data: {
          username,
          email,
        }
      }
    } catch (e) {
      console.log({ e })
      throw new HttpException(e.message, e.status)
    }
  }

  async editUser(user: Partial<User>, id: number): Promise<ApiResponseModel<any>> {
    try {
      await this._throwExceptionIfUsernameExist(user.username)

      const userData = {
        ...user,
        id
      }

      const newUser = await this.usersRepository.save({ ...userData })
      return {
        message: 'Success',
        data: {
          user: newUser
        }
      }
    }

    catch (e) {
      throw new HttpException(e.message, e.status)
    }
  }
}
