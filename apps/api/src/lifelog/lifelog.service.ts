import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationLog, PhotoMemory, PhotoTag } from '../database/entities';
import { CreateLocationLogDto, UploadPhotoDto } from './dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  async createLocationLog(
    userId: string,
    createLocationLogDto: CreateLocationLogDto,
  ): Promise<LocationLog> {
    const locationLog = this.locationLogRepository.create({
      ...createLocationLogDto,
      userId,
      arrivalTime: new Date(createLocationLogDto.arrivalTime),
      departureTime: createLocationLogDto.departureTime
        ? new Date(createLocationLogDto.departureTime)
        : undefined,
    });

    return this.locationLogRepository.save(locationLog);
  }

  async getLocationLogs(userId: string, date?: string): Promise<LocationLog[]> {
    const query = this.locationLogRepository
      .createQueryBuilder('locationLog')
      .where('locationLog.userId = :userId', { userId })
      .orderBy('locationLog.arrivalTime', 'ASC');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query.andWhere('locationLog.arrivalTime >= :startDate', { startDate });
      query.andWhere('locationLog.arrivalTime < :endDate', { endDate });
    }

    return query.getMany();
  }

  async getLocationLogById(userId: string, id: string): Promise<LocationLog> {
    const locationLog = await this.locationLogRepository.findOne({
      where: { id, userId },
    });

    if (!locationLog) {
      throw new NotFoundException('위치 로그를 찾을 수 없습니다');
    }

    return locationLog;
  }

  async updateLocationLog(
    userId: string,
    id: string,
    updateData: Partial<CreateLocationLogDto>,
  ): Promise<LocationLog> {
    const locationLog = await this.getLocationLogById(userId, id);

    Object.assign(locationLog, {
      ...updateData,
      arrivalTime: updateData.arrivalTime
        ? new Date(updateData.arrivalTime)
        : locationLog.arrivalTime,
      departureTime: updateData.departureTime
        ? new Date(updateData.departureTime)
        : locationLog.departureTime,
    });

    return this.locationLogRepository.save(locationLog);
  }

  async deleteLocationLog(userId: string, id: string): Promise<void> {
    const locationLog = await this.getLocationLogById(userId, id);
    await this.locationLogRepository.remove(locationLog);
  }

  async getLocationStats(userId: string, startDate?: string, endDate?: string) {
    const query = this.locationLogRepository
      .createQueryBuilder('locationLog')
      .where('locationLog.userId = :userId', { userId });

    if (startDate) {
      query.andWhere('locationLog.arrivalTime >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      query.andWhere('locationLog.arrivalTime <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    const logs = await query.getMany();

    const stats = {
      totalVisits: logs.length,
      uniquePlaces: new Set(logs.map((log) => log.placeName).filter(Boolean))
        .size,
      totalStayTime: logs.reduce(
        (total, log) => total + (log.stayDuration || 0),
        0,
      ),
      mostVisitedPlace: this.getMostVisitedPlace(logs),
    };

    return stats;
  }

  private getMostVisitedPlace(logs: LocationLog[]): string | null {
    const placeCounts = logs.reduce(
      (acc, log) => {
        if (log.placeName) {
          acc[log.placeName] = (acc[log.placeName] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostVisited = Object.entries(placeCounts).reduce(
      (max, [place, count]) => (count > max.count ? { place, count } : max),
      { place: null, count: 0 } as { place: string | null; count: number },
    );

    return mostVisited.place;
  }

  async uploadPhoto(
    userId: string,
    photoData: {
      filename: string;
      originalName: string;
      mimeType: string;
      fileSize: number;
      latitude?: number;
      longitude?: number;
      address?: string;
      takenAt?: string;
      caption?: string;
      isManuallyAdded?: boolean;
      tags?: string[];
    },
  ): Promise<PhotoMemory> {
    const { tags, ...photoInfo } = photoData;

    const photoMemory = this.photoMemoryRepository.create({
      ...photoInfo,
      userId,
      uploadedAt: new Date(),
      takenAt: photoData.takenAt ? new Date(photoData.takenAt) : undefined,
    });

    const savedPhoto = await this.photoMemoryRepository.save(photoMemory);

    // 태그 저장
    if (tags && tags.length > 0) {
      const photoTags = tags.map((tag) =>
        this.photoTagRepository.create({
          photoMemoryId: savedPhoto.id,
          tag: tag,
        }),
      );
      await this.photoTagRepository.save(photoTags);
    }

    return savedPhoto;
  }

  async getPhotos(userId: string, date?: string): Promise<PhotoMemory[]> {
    const query = this.photoMemoryRepository
      .createQueryBuilder('photo')
      .leftJoinAndSelect('photo.tags', 'tags')
      .where('photo.userId = :userId', { userId })
      .orderBy('photo.uploadedAt', 'DESC');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query.andWhere('photo.uploadedAt >= :startDate', { startDate });
      query.andWhere('photo.uploadedAt < :endDate', { endDate });
    }

    return query.getMany();
  }

  async getPhotoById(userId: string, id: string): Promise<PhotoMemory> {
    const photo = await this.photoMemoryRepository.findOne({
      where: { id, userId },
      relations: ['tags'],
    });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다');
    }

    return photo;
  }

  async updatePhoto(
    userId: string,
    id: string,
    updateData: Partial<UploadPhotoDto>,
  ): Promise<PhotoMemory> {
    const photo = await this.getPhotoById(userId, id);

    Object.assign(photo, {
      ...updateData,
      takenAt: updateData.takenAt
        ? new Date(updateData.takenAt)
        : photo.takenAt,
    });

    const savedPhoto = await this.photoMemoryRepository.save(photo);

    // 태그 업데이트
    if (updateData.tags) {
      // 기존 태그 삭제
      await this.photoTagRepository.delete({ photoMemoryId: id });

      // 새 태그 추가
      if (updateData.tags.length > 0) {
        const photoTags = updateData.tags.map((tag) =>
          this.photoTagRepository.create({
            photoMemoryId: id,
            tag: tag,
          }),
        );
        await this.photoTagRepository.save(photoTags);
      }
    }

    return savedPhoto;
  }

  async deletePhoto(userId: string, id: string): Promise<void> {
    const photo = await this.getPhotoById(userId, id);
    await this.photoMemoryRepository.remove(photo);
  }

  async matchPhotoWithLocation(
    userId: string,
    photoId: string,
    locationLogId: string,
  ): Promise<PhotoMemory> {
    const photo = await this.getPhotoById(userId, photoId);

    photo.locationLogId = locationLogId;
    return this.photoMemoryRepository.save(photo);
  }
}
