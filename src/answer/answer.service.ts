import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/question.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { AnswerResponse, toAnswerDTO } from './answer.dto';
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
  ) { }

  getAll(): Promise<Answer[]> {
    return this.answerRepository.find()
  }

  async toAnswer(data: toAnswerDTO): Promise<AnswerResponse<Answer>> {
    try {
      const answerData = this.answerRepository.create({ ...data })
      const question = await this.questionRepository.findOne({ id: data.questionId })
  
      if (!question) {
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
      }
  
      const user = await this.userRepository.findOne({ id: data.userId })
  
      if (!user) {
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
      }
  
      const answerResponse = await this.answerRepository.save({
        ...answerData,
        question: { 
          id: question.id
        },
        user: {
          id: user.id
        }
      })

      await this.questionRepository.update(question.id, { answer: { id: answerResponse.id }})

      return {
        message: 'Sucesss',
        answer: answerResponse
      }
    } catch (e) {
      throw new HttpException(e.message, e.code);
    }
  }
}