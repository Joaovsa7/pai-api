import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

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