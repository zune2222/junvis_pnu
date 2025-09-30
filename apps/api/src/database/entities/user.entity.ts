import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Schedule } from './schedule.entity'
import { TransportSetting } from './transport-setting.entity'
import { LocationLog } from './location-log.entity'
import { PhotoMemory } from './photo-memory.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ name: 'student_id', unique: true, nullable: true })
  studentId?: string;

  @Column({ nullable: true })
  major?: string;

  @Column({ nullable: true })
  semester?: string;

  @Column({ name: 'pnu_user_id', nullable: true })
  pnuUserId?: string;

  @Column({ name: 'pnu_password', nullable: true })
  pnuPassword?: string;

  @Column({ name: 'is_pnu_connected', default: false })
  isPnuConnected: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @OneToMany(
    () => TransportSetting,
    (transportSetting) => transportSetting.user,
  )
  transportSettings: TransportSetting[];

  @OneToMany(() => LocationLog, (locationLog) => locationLog.user)
  locationLogs: LocationLog[]

  @OneToMany(() => PhotoMemory, (photoMemory) => photoMemory.user)
  photoMemories: PhotoMemory[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
