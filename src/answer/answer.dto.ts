import { Answer } from "./answer.entity";

export interface toAnswerDTO extends Answer {
  userId: number
  questionId: number
}