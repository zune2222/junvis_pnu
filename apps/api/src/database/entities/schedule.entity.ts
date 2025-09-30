import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  subject: string;

  @Column({ nullable: true })
  professor?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number; // 0=일요일, 1=월요일, ...

  @Column({ name: 'start_time' })
  startTime: string; // HH:MM 형식

  @Column({ name: 'end_time' })
  endTime: string; // HH:MM 형식

  @Column()
  semester: string;

  @Column({ name: 'is_from_pnu', default: false })
  isFromPnu: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
