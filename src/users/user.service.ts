import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Question } from 'src/question/question.entity';
import { QuestionService } from 'src/question/question.service';
import { DeleteResult, Like, Repository } from 'typeorm';
import { RegisterDTO, UserExist, UserProfileDTO } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionsService: QuestionService
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

  async getProfile(username: string): Promise<UserProfileDTO<User>> {
    try {
      const [user]: User[] = await this.getByUsername(username);
      
      if (!user?.username) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      const questions: Question[] = await this.questionsService.byUser(user.username);
      const answeredQuestions = questions.filter(({ answer }) => Boolean(answer)).length;
      user.password = null;
      return {
        user,
        questions,
        receivedQuestions: questions.length,
        answeredQuestions,
      }
    } catch (e) {
      throw new HttpException(e.message, e.status)
    }
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
      if (!data.password) {
        throw new HttpException('You should to pass a user password', HttpStatus.BAD_REQUEST)
      }

      const hashedPassword = await hash(data.password, 10)
      const userData = this.usersRepository.create({ ...data, name: data.username, password: hashedPassword })
      const { username, email, id } = await this.usersRepository.save(userData)
      const token = await this.authService.createToken({ username, email })
      return {
        username,
        email,
        id,
        ...token
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