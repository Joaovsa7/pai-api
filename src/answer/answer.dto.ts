import { Answer } from "./answer.entity";

export interface toAnswerDTO extends Answer {
  userId: number
  questionId: number
}

export interface AnswerResponse<T> {
  message: string;
  answer: T
}