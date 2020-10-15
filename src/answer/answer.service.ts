import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/question.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { toAnswerDTO } from './answer.dto';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ) {}

  findAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async toAnswer(data: toAnswerDTO): Promise<Answer> {
    const answerData = this.answerRepository.create({ ...data })
    const question = await this.questionRepository.findOne({ id: data.questionId })
    const user = await this.userRepository.findOne({ id: data.userId })
    const response = await this.answerRepository.save({
      ...answerData,
      question,
      user
    })
    
    return response
  }
}