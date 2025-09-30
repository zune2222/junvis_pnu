import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PhotoMemory } from './photo-memory.entity'

@Entity('photo_tags')
export class PhotoTag {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'photo_memory_id' })
  photoMemoryId: string

  @ManyToOne(() => PhotoMemory, (photoMemory) => photoMemory.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photo_memory_id' })
  photoMemory: PhotoMemory

  @Column()
  tag: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
