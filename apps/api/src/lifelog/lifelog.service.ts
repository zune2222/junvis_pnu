import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LocationLog, PhotoMemory, PhotoTag } from '../database/entities'
import { CreateLocationLogDto } from './dto'

@Injectable()
export class LifelogService {
  constructor(
    @InjectRepository(LocationLog)
    private locationLogRepository: Repository<LocationLog>,
    @InjectRepository(PhotoMemory)
    private photoMemoryRepository: Repository<PhotoMemory>,
    @InjectRepository(PhotoTag)
    private photoTagRepository: Repository<PhotoTag>,
  ) {}

  async createLocationLog(userId: string, createLocationLogDto: CreateLocationLogDto): Promise<LocationLog> {
    const locationLog = this.locationLogRepository.create({
      ...createLocationLogDto,
      userId,
      arrivalTime: new Date(createLocationLogDto.arrivalTime),
      departureTime: createLocationLogDto.departureTime ? new Date(createLocationLogDto.departureTime) : undefined,
    })

    return this.locationLogRepository.save(locationLog)
  }

  async getLocationLogs(userId: string, date?: string): Promise<LocationLog[]> {
    const query = this.locationLogRepository
      .createQueryBuilder('locationLog')
      .where('locationLog.userId = :userId', { userId })
      .orderBy('locationLog.arrivalTime', 'ASC')

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      
      query.andWhere('locationLog.arrivalTime >= :startDate', { startDate })
      query.andWhere('locationLog.arrivalTime < :endDate', { endDate })
    }

    return query.getMany()
  }

  async getLocationLogById(userId: string, id: string): Promise<LocationLog> {
    const locationLog = await this.locationLogRepository.findOne({
      where: { id, userId },
    })

    if (!locationLog) {
      throw new NotFoundException('위치 로그를 찾을 수 없습니다')
    }

    return locationLog
  }

  async updateLocationLog(
    userId: string,
    id: string,
    updateData: Partial<CreateLocationLogDto>,
  ): Promise<LocationLog> {
    const locationLog = await this.getLocationLogById(userId, id)

    Object.assign(locationLog, {
      ...updateData,
      arrivalTime: updateData.arrivalTime ? new Date(updateData.arrivalTime) : locationLog.arrivalTime,
      departureTime: updateData.departureTime ? new Date(updateData.departureTime) : locationLog.departureTime,
    })

    return this.locationLogRepository.save(locationLog)
  }

  async deleteLocationLog(userId: string, id: string): Promise<void> {
    const locationLog = await this.getLocationLogById(userId, id)
    await this.locationLogRepository.remove(locationLog)
  }

  async getLocationStats(userId: string, startDate?: string, endDate?: string) {
    const query = this.locationLogRepository
      .createQueryBuilder('locationLog')
      .where('locationLog.userId = :userId', { userId })

    if (startDate) {
      query.andWhere('locationLog.arrivalTime >= :startDate', { startDate: new Date(startDate) })
    }

    if (endDate) {
      query.andWhere('locationLog.arrivalTime <= :endDate', { endDate: new Date(endDate) })
    }

    const logs = await query.getMany()

    const stats = {
      totalVisits: logs.length,
      uniquePlaces: new Set(logs.map(log => log.placeName).filter(Boolean)).size,
      totalStayTime: logs.reduce((total, log) => total + (log.stayDuration || 0), 0),
      mostVisitedPlace: this.getMostVisitedPlace(logs),
    }

    return stats
  }

  private getMostVisitedPlace(logs: LocationLog[]): string | null {
    const placeCounts = logs.reduce((acc, log) => {
      if (log.placeName) {
        acc[log.placeName] = (acc[log.placeName] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const mostVisited = Object.entries(placeCounts).reduce(
      (max, [place, count]) => (count > max.count ? { place, count } : max),
      { place: null, count: 0 } as { place: string | null; count: number }
    )

    return mostVisited.place
  }
}
