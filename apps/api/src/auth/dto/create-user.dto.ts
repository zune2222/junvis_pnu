import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: '올바른 이메일 주소를 입력해주세요' })
  email: string

  @IsString({ message: '비밀번호는 문자열이어야 합니다' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  password: string

  @IsString({ message: '이름은 문자열이어야 합니다' })
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(50, { message: '이름은 최대 50자까지 입력 가능합니다' })
  name: string;
}