import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, IsNull, Not, Repository } from 'typeorm';
import { Question } from './question.entity';
import { User } from '../users/user.entity'
import { Answer } from '../answer/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>
  ) { }

  async getAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async byUser(username: string) {
    try {
      const [user] = await this.userRepository.find({ username })

      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        }, HttpStatus.NOT_FOUND);
      }

      const questions = await getManager()
        .createQueryBuilder(Question, 'Question')
        .where("userId = :id", { id: user.id })
        .andWhere('answerId is not null')
        .getMany();
  
      const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
        const answers: any = await this.answerRepository.find({ where: { question: { id: question.id } } })
        return {
          ...question,
          answer: answers
        }
      }))

      return questionsWithAnswers
    } catch (e) {
      console.log({ e })
      throw new HttpException(e.response.error, e.status)
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
    console.log({ data })
    const user = await this.userRepository.findOne({ id: data.userId })

    if (!user) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      }, HttpStatus.NOT_FOUND);
    }

    const questionData = this.questionRepository.create({ ...data })
    const response = await this.questionRepository.save({
      ...questionData,
      user
    })

    return response
  }
}