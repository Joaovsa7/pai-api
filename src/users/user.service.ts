import { hash } from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserExist } from './user.dto';
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

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email })
  }

  async usernameExist({ username }: UserExist): Promise<boolean> {
    const hasUser = await this.usersRepository.findOne({ username })
    return !!hasUser
  }


  findByPayload({ username }: any): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username }
    });
  }


  async createUser(data: User): Promise<User> {
    const hashedPassword = await hash(data.password, 10)
    const userAlreadyExist = await this.usernameExist({ username: data.username })
    if (userAlreadyExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const userData = this.usersRepository.create({ ...data, password: hashedPassword })
    const response = await this.usersRepository.save(userData)
    return response
  }
}