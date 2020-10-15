import { Question } from 'src/question/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Question, question => question)
  questions: Question[]

  @Column({ type: 'char', length: '60' }) 
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  bio: string;
  
  @Column()
  born_date: string;

  @Column({ nullable: true })
  social_networks: string;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: string;

  @Column({ default: true })
  isActive: boolean;
}