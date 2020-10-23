import { Question } from "src/question/question.entity";

export interface UserExist {
  username: string
  email?: string
}

export interface RegisterDTO {
  username: string
  email: string
  password?: string
  id?: number
}

export interface UserProfileDTO<T> {
  user: T
  answeredQuestions: number,
  receivedQuestions: number,
  questions: Question[]
}