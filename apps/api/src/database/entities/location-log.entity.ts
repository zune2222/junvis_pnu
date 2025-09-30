import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('location_logs')
export class LocationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => User, (user) => user.locationLogs)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  placeName?: string

  @Column({ name: 'arrival_time' })
  arrivalTime: Date

  @Column({ name: 'departure_time', nullable: true })
  departureTime?: Date

  @Column({ name: 'stay_duration', nullable: true })
  stayDuration?: number // 분 단위

  @Column({ name: 'is_manually_added', default: false })
  isManuallyAdded: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
