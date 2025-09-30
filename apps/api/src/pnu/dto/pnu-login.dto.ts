import { IsString, IsNotEmpty } from 'class-validator';

export class PnuLoginDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userPw: string;
}
