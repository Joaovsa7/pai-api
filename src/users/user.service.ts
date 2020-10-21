import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DeleteResult, Like, Repository } from 'typeorm';
import { RegisterDTO, UserExist } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  getByUsername(username: string): Promise<User[]> {
    return this.usersRepository.find({ username })
  }

  getByUsernameQuery(username: string): Promise<User[]> {
    return this.usersRepository.find({ where: { username: Like(`%${username}%`) } });
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email })
  }

  async _throwExceptionIfUsernameExist(username: string) {
    const userAlreadyExist = await this.userExist({ username })
    if (userAlreadyExist) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
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


  async createUser(data: User): Promise<RegisterDTO> {
    try {
      await this._throwExceptionIfUsernameExist(data.username)
      console.log({ data })
      if (!data.password) {
        throw new HttpException('You should to pass a user password', HttpStatus.BAD_REQUEST)
      }

      const hashedPassword = await hash(data.password, 10)
      const userData = this.usersRepository.create({ ...data, password: hashedPassword })
      const { username, email, id } = await this.usersRepository.save(userData)
      return {
        username,
        email,
        id
      }
    } catch (e) {
      console.log({ e })
      throw new HttpException(e.message, e.status)
    }
  }

  async editUser(user: Partial<User>, id: number): Promise<User> {
    try {
      await this._throwExceptionIfUsernameExist(user.username)

      const userData = {
        ...user,
        id
      }

      const newUser = await this.usersRepository.save({ ...userData })
      return newUser

    }

    catch (e) {
      throw new HttpException(e.message, e.status)
    }
  }
}