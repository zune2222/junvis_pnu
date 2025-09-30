import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator'

export class CreateLocationLogDto {
  @IsNumber()
  latitude: number

  @IsNumber()
  longitude: number

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  placeName?: string

  @IsDateString()
  arrivalTime: string

  @IsOptional()
  @IsDateString()
  departureTime?: string

  @IsOptional()
  @IsNumber()
  stayDuration?: number

  @IsOptional()
  isManuallyAdded?: boolean
}
