import { Question } from '../question/question.entity';
import { User } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, question => question.id)
  question: Question;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  text: string;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: string;

  @Column({ default: true })
  isActive: boolean;
} 