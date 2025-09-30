import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { PhotoTag } from './photo-tag.entity'

@Entity('photo_memories')
export class PhotoMemory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => User, (user) => user.photoMemories)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'location_log_id', nullable: true })
  locationLogId?: string

  @Column()
  filename: string

  @Column()
  originalName: string

  @Column()
  mimeType: string

  @Column()
  fileSize: number

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number

  @Column({ nullable: true })
  address?: string

  @Column({ name: 'taken_at', nullable: true })
  takenAt?: Date

  @Column({ name: 'uploaded_at' })
  uploadedAt: Date

  @Column({ type: 'text', nullable: true })
  caption?: string

  @Column({ name: 'is_manually_added', default: false })
  isManuallyAdded: boolean

  @OneToMany(() => PhotoTag, (tag) => tag.photoMemory)
  tags: PhotoTag[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
