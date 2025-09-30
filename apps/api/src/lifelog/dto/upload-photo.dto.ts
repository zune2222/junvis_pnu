import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadPhotoDto {
  // 파일 정보는 multer에서 처리되므로 DTO에서 제외
  // filename, originalName, mimeType, fileSize는 controller에서 file 객체로부터 추출

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  takenAt?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isManuallyAdded?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
