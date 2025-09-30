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
} from '@nestjs/common'
import { LifelogService } from './lifelog.service'
import { CreateLocationLogDto } from './dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('lifelog')
@UseGuards(JwtAuthGuard)
export class LifelogController {
  constructor(private readonly lifelogService: LifelogService) {}

  @Post('location-logs')
  async createLocationLog(
    @Request() req: any,
    @Body() createLocationLogDto: CreateLocationLogDto,
  ) {
    return this.lifelogService.createLocationLog(req.user.id, createLocationLogDto)
  }

  @Get('location-logs')
  async getLocationLogs(
    @Request() req: any,
    @Query('date') date?: string,
  ) {
    return this.lifelogService.getLocationLogs(req.user.id, date)
  }

  @Get('location-logs/:id')
  async getLocationLogById(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.lifelogService.getLocationLogById(req.user.id, id)
  }

  @Put('location-logs/:id')
  async updateLocationLog(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateLocationLogDto>,
  ) {
    return this.lifelogService.updateLocationLog(req.user.id, id, updateData)
  }

  @Delete('location-logs/:id')
  async deleteLocationLog(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    await this.lifelogService.deleteLocationLog(req.user.id, id)
    return { message: '위치 로그가 삭제되었습니다' }
  }

  @Get('stats')
  async getLocationStats(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.lifelogService.getLocationStats(req.user.id, startDate, endDate)
  }
}
