import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { User } from '../users/user.entity'
import { ByUserDTO } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async byUser(username: string): Promise<ByUserDTO> {
    const user = await this.userRepository.findOne(username)

    if (!user) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      }, HttpStatus.NOT_FOUND);
    }

    const questions = await this.questionRepository.find({ where: { user: { id: user.id }} })
    return {
      questions
    }
  }

  async delete(id: string): Promise<any> {
    const question = await this.questionRepository.findOne(id)

    if (!question) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.questionRepository.save({ ...question, isActive: false })
    }

    catch (e) {
      throw new HttpException(e.message, e.status)
    }

    return {
      message: 'Success'
    }
  }

  async create(data: any): Promise<Question> {
    const userData = this.questionRepository.create({ ...data })
    const user = await this.userRepository.findOne({ id: data.userId })
    const response = await this.questionRepository.save({
      ...userData,
      user
    })
  
    return response
  }
}