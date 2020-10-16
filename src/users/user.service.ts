import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserExist } from './user.dto';
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

  async usernameExist({ username }: UserExist): Promise<boolean> {
    const hasUser = await this.usersRepository.findOne({ username })
    return !!hasUser
  }

  async createUser(data: User): Promise<User> {
    const userData = this.usersRepository.create({ ...data })
    const response = await this.usersRepository.save(userData)
    return response
  }
}