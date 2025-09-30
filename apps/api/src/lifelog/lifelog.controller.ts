import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LifelogService } from './lifelog.service';
import { CreateLocationLogDto, UploadPhotoDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('lifelog')
@UseGuards(JwtAuthGuard)
export class LifelogController {
  constructor(private readonly lifelogService: LifelogService) {}

  @Post('location-logs')
  async createLocationLog(
    @Request() req: any,
    @Body() createLocationLogDto: CreateLocationLogDto,
  ) {
    return this.lifelogService.createLocationLog(
      req.user.id,
      createLocationLogDto,
    );
  }

  @Get('location-logs')
  async getLocationLogs(@Request() req: any, @Query('date') date?: string) {
    return this.lifelogService.getLocationLogs(req.user.id, date);
  }

  @Get('location-logs/:id')
  async getLocationLogById(@Request() req: any, @Param('id') id: string) {
    return this.lifelogService.getLocationLogById(req.user.id, id);
  }

  @Put('location-logs/:id')
  async updateLocationLog(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateLocationLogDto>,
  ) {
    return this.lifelogService.updateLocationLog(req.user.id, id, updateData);
  }

  @Delete('location-logs/:id')
  async deleteLocationLog(@Request() req: any, @Param('id') id: string) {
    await this.lifelogService.deleteLocationLog(req.user.id, id);
    return { message: '위치 로그가 삭제되었습니다' };
  }

  @Get('stats')
  async getLocationStats(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.lifelogService.getLocationStats(
      req.user.id,
      startDate,
      endDate,
    );
  }

  // 사진 관련 API
  @Post('photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadPhoto(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadPhotoDto: UploadPhotoDto,
  ) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }

    const photoData = {
      ...uploadPhotoDto,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };

    return this.lifelogService.uploadPhoto(req.user.id, photoData);
  }

  @Get('photos')
  async getPhotos(@Request() req: any, @Query('date') date?: string) {
    return this.lifelogService.getPhotos(req.user.id, date);
  }

  @Get('photos/:id')
  async getPhotoById(@Request() req: any, @Param('id') id: string) {
    return this.lifelogService.getPhotoById(req.user.id, id);
  }

  @Put('photos/:id')
  async updatePhoto(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateData: Partial<UploadPhotoDto>,
  ) {
    return this.lifelogService.updatePhoto(req.user.id, id, updateData);
  }

  @Delete('photos/:id')
  async deletePhoto(@Request() req: any, @Param('id') id: string) {
    await this.lifelogService.deletePhoto(req.user.id, id);
    return { message: '사진이 삭제되었습니다' };
  }

  @Post('photos/:photoId/match/:locationLogId')
  async matchPhotoWithLocation(
    @Request() req: any,
    @Param('photoId') photoId: string,
    @Param('locationLogId') locationLogId: string,
  ) {
    return this.lifelogService.matchPhotoWithLocation(
      req.user.id,
      photoId,
      locationLogId,
    );
  }
}
