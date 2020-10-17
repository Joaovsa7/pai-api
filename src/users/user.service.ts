import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { ApiResponseModel } from 'src/shared/apiResponseModel/apiResponseModel';
import { DeleteResult, Like, Repository } from 'typeorm';
import { RegisterDTO, UserExist } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
  
  getByUsernameQuery(username: string): Promise<User[]> {
    return this.usersRepository.find({ where: { username: Like(`%${username}%`)}});
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email })
  }

  async _throwExceptionIfUsernameExist(username: string) {
    const userAlreadyExist = await this.userExist({ username })
    if (userAlreadyExist) {
      throw new HttpException('Userna me already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async userExist({ username, email }: UserExist): Promise<boolean> {
    const query = username ? { username } : { email }
    const hasUser = await this.usersRepository.findOne(query)
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
      
      if (!data.password) {
        throw new HttpException('You should to pass a user password', HttpStatus.BAD_REQUEST)
      }

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