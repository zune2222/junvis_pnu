import { IsString, IsNotEmpty } from 'class-validator';

export class PnuTimetableDto {
  @IsString()
  @IsNotEmpty()
  syear: string;

  @IsString()
  @IsNotEmpty()
  termGcd: string;
}
