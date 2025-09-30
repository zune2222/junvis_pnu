import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as NodeRSA from 'node-rsa';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userId?: string;
    sToken?: string;
    nResult?: number;
    userInfo?: {
      studentId: string;
      ip?: string;
      loginDevice?: string;
    };
  };
}

export interface TimetableResponse {
  success: boolean;
  data: unknown;
}

export interface UserInfoResponse {
  success: boolean;
  data: {
    studentId?: string;
    name?: string;
    major?: string;
    semester?: string;
    grade?: string;
  };
}

@Injectable()
export class PnuService {
  private readonly PNU_HOST = 'https://onestop.pusan.ac.kr';
  private readonly LOGIN_HOST = 'https://login.pusan.ac.kr';
  private readonly RSA_MODULUS =
    '965d2cea4a9c99d8ab3c2b0e7536cc18af14ea11d73da35fba1b14ac5521c78124dc3bc56e39bf422823da67ab58f413ecdbf8932ed13982d3143d7e4b8d3093589b92384b1a35b5d1ed654fae01553ea2a8c4cee45d0c66d65504af01b6b8070a43afddb27cbb8c9c546c0a41e39ea697a46bee5eed79f7f2c4991ddbc0d25fc42e412dd1864b3e3a67107c5b744e82476fbf78452f001363e145e05663c3e7ac3a9c87ccff458ba5b4cf441c4aef14f38b93c764c924d4176de94085838bea36333c823e6e5c055277cbd74491bb0c0fd779a6a14e848d57063299739921c680d2e0ae4e44bd536d992df5a96ba08a0b1e5d9878fcb976d575f217d83051d1';
  private readonly RSA_EXPONENT = '10001';

  private client: AxiosInstance;
  private csrfToken: string = '618149e1-8457-447d-8ccf-6eaa7c13c2ca';
  private cookies: string = 'updateExpiredPw=N; ssotoken=Vy3zFySSOx5FLOGINx5F1zTyGIDx5FDEMO1zCy1759216704zPy86400zAy23zEyiCnRKvbFdcSOv38hasA7Xg71ApS8FcHRcWx2BdFx2BdiWx7Ax78uFLqtQRX9cx2FftMox7ADmPqGmssNLx786ox2Fi9Ux2FJ65PPGsx2BNduOhmZXXEkvWgj6p3jb93lLSc7Y9gFL8teWYkhdvBCIcO7BiCwevbPA0nPnLDlhimx79E6KZ8ASYXvZJwGr9440b3tucWx78x2BMcTJvPGBx7AnU2c07WlV0lZmCmwmrmoBOIHXlEPvYCh44V0x79PELx2F6aNZ9DvnXx2Bx2BqBZdXrUZU5x78x2FkYIgpGVT3v40AbudTwoWVFMdRt6MeRqN0gTs2Zkx2FPXx2FBWgNUWx2FAjoCsEJue8nx79MoH7id6iK7gXIrL3fMYwmx7ATUMhuAx3Dx3DzKyBS7lU9KZlqGkx79QeLT9x78Beh30mHkVrNux7AiMWbMx2FRx2BCHDtcFN1kLQp00KN1dRx2BeENPzSSy00000000111zUURy85983ece2b042d06zMyLHunNix78T3IQx3Dz; JSESSIONID=9DF5EA848E3A5E85A776A58A6577D278; _ga_0CXQEPQ924=GS2.1.s1756567990$o1$g1$t1756568505$j60$l0$h0; _ga_CMYN6GGDCD=GS2.1.s1756567989$o1$g1$t1756568505$j58$l0$h0; _ga=GA1.3.1421218373.1756567990';

  constructor() {
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15'
      }
    });
  }

  private encryptData(dataObject: Record<string, string>): string {
    try {
      const key = new NodeRSA();
      key.importKey(
        {
          n: Buffer.from(this.RSA_MODULUS, 'hex'),
          e: parseInt(this.RSA_EXPONENT, 16),
        },
        'components-public',
      );

      const jsonString = JSON.stringify(dataObject);
      const byteLength = Buffer.byteLength(jsonString, 'utf8');

      if (byteLength > 245) {
        const encryptedChunks: string[] = [];
        let startIndex = 0;

        while (startIndex < jsonString.length) {
          const chunk = jsonString.substring(startIndex, startIndex + 100);
          startIndex += 100;
          const encrypted = key.encrypt(chunk, 'hex') as string;
          encryptedChunks.push(encrypted);
        }
        return encryptedChunks.join(',');
      } else {
        return key.encrypt(jsonString, 'hex') as string;
      }
    } catch (error) {
      console.error('RSA 암호화 에러:', error);
      throw new Error('데이터 암호화에 실패했습니다.');
    }
  }

  private async getCSRFToken(): Promise<void> {
    try {
      console.log('CSRF 토큰 가져오는 중...');
      
      const loginPageUrl = `${this.LOGIN_HOST}/onestop/loginPage`;
      const response = await this.client.get(loginPageUrl);
      
      // 쿠키에서 CSRF 토큰 추출
      const setCookieHeaders = response.headers['set-cookie'];
      if (setCookieHeaders) {
        this.cookies = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ');
        console.log('초기 쿠키 설정됨');
      }

      // HTML에서 CSRF 토큰 추출 (다양한 패턴 시도)
      const htmlContent = response.data;
      const csrfPatterns = [
        /name="csrf_token"[^>]*value="([^"]+)"/i,
        /csrf[_-]?token["']?\s*:\s*["']([^"']+)["']/i,
        /_token["']?\s*:\s*["']([^"']+)["']/i,
        /X-CSRF-TOKEN["']?\s*:\s*["']([^"']+)["']/i,
        /csrfToken\s*=\s*["']([^"']+)["']/i,
        /token["']?\s*:\s*["']([^"']+)["']/i
      ];
      
      let csrfMatch = null;
      for (const pattern of csrfPatterns) {
        csrfMatch = htmlContent.match(pattern);
        if (csrfMatch) break;
      }
      
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
        console.log('CSRF 토큰 추출 성공:', this.csrfToken.substring(0, 8) + '...');
      } else {
        console.log('CSRF 토큰을 찾을 수 없어 기본값 사용');
        console.log('HTML 내용 일부:', htmlContent.substring(0, 500));
      }

    } catch (error) {
      console.error('CSRF 토큰 가져오기 실패:', error);
      console.log('기본 CSRF 토큰 사용');
    }
  }

  async login(userId: string, userPw: string): Promise<LoginResponse> {
    console.log('PNU 로그인 시도 - 더미 데이터 반환');
    
    // 더미 데이터로 성공 응답 반환
    return {
      success: true,
      message: '로그인 성공 (더미 데이터)',
      data: {
        userId: '202155556',
        sToken: 'dummy-token',
        nResult: 0,
        userInfo: {
          studentId: '202155556',
          ip: '127.0.0.1',
          loginDevice: 'Web Browser'
        }
      }
    };
  }

  async getTimetable(syear: string, termGcd: string): Promise<TimetableResponse> {
    console.log('시간표 조회 시도 - 더미 데이터 반환');
    
    // 더미 시간표 데이터 반환
    const dummyTimetable = [
      {
        id: '1',
        subject: '공학작문및발표',
        time: '10:30 - 11:30',
        location: '제6공학관(컴퓨터공학관)(201)-6409',
        professor: '우균'
      },
      {
        id: '2',
        subject: '이산수학(II)',
        time: '13:30 - 14:30',
        location: '제6공학관(컴퓨터공학관)(201)-6202',
        professor: '손준영'
      },
      {
        id: '3',
        subject: '전기전자공학개론',
        time: '13:30 - 14:30',
        location: '제6공학관(컴퓨터공학관)(201)-6202',
        professor: '김정구'
      },
      {
        id: '4',
        subject: '일반물리학(II)',
        time: '15:00 - 16:00',
        location: '제6공학관(컴퓨터공학관)(201)-6516',
        professor: '천미연'
      },
      {
        id: '5',
        subject: '플랫폼기반프로그래밍',
        time: '15:00 - 16:00',
        location: '제6공학관(컴퓨터공학관)(201)-6409-1',
        professor: '이선열'
      },
      {
        id: '6',
        subject: '소프트웨어공학',
        time: '16:30 - 17:30',
        location: '제6공학관(컴퓨터공학관)(201)-6203',
        professor: '채흥석'
      },
      {
        id: '7',
        subject: '생활속의심리학',
        time: '18:00 - 19:00',
        location: '성학관(422)-101',
        professor: '서수균'
      },
      {
        id: '8',
        subject: '임베디드시스템설계및실험',
        time: '18:30 - 21:30',
        location: '제6공학관(컴퓨터공학관)(201)-6517',
        professor: '김원석'
      }
    ];

    return {
      success: true,
      data: dummyTimetable,
    };
  }

  async getUserInfo(): Promise<UserInfoResponse> {
    console.log('사용자 정보 조회 시도 - 더미 데이터 반환');
    
    // 더미 사용자 정보 반환
    return {
      success: true,
      data: {
        studentId: '202155556',
        name: '박준이',
        major: '정보컴퓨터공학부',
        college: '정보의생명공학대학',
        semester: '2024년 2학기',
        grade: '3학년'
      }
    };
  }
}
