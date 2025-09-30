import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PnuService, LoginResponse, TimetableResponse, UserInfoResponse } from './pnu.service';
import { PnuLoginDto } from './dto/pnu-login.dto';
import { PnuTimetableDto } from './dto/pnu-timetable.dto';

@Controller('pnu')
export class PnuController {
  constructor(private readonly pnuService: PnuService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', message: 'PNU service is running' };
  }

  @Post('test')
  testConnection(@Body() body: { message: string }) {
    console.log('테스트 요청 받음:', body);
    return { 
      status: 'success', 
      message: 'Test endpoint working',
      received: body
    };
  }

  @Post('login')
  async login(@Body() pnuLoginDto: PnuLoginDto): Promise<LoginResponse> {
    try {
      console.log('PNU 컨트롤러 로그인 요청 받음');
      console.log('요청 데이터:', { userId: pnuLoginDto.userId ? 'exists' : 'missing', userPw: pnuLoginDto.userPw ? 'exists' : 'missing' });
      
      const result = await this.pnuService.login(
        pnuLoginDto.userId,
        pnuLoginDto.userPw,
      );
      
      console.log('PNU 서비스 로그인 성공');
      return result;
    } catch (error: unknown) {
      console.error('PNU 컨트롤러 에러:', error);
      
      const message = error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.';
      
      console.error('클라이언트에 전송할 에러 메시지:', message);
      
      throw new HttpException(
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('timetable')
  async getTimetable(@Body() pnuTimetableDto: PnuTimetableDto): Promise<TimetableResponse> {
    try {
      const result = await this.pnuService.getTimetable(
        pnuTimetableDto.syear,
        pnuTimetableDto.termGcd,
      );
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '시간표 조회 중 오류가 발생했습니다.';
      throw new HttpException(
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('userinfo')
  async getUserInfo(): Promise<UserInfoResponse> {
    try {
      console.log('사용자 정보 조회 요청 받음');
      
      const result = await this.pnuService.getUserInfo();
      
      console.log('사용자 정보 조회 성공');
      return result;
    } catch (error: unknown) {
      console.error('사용자 정보 조회 컨트롤러 에러:', error);
      
      const message = error instanceof Error ? error.message : '사용자 정보 조회 중 오류가 발생했습니다.';
      
      throw new HttpException(
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
