import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: '올바른 이메일 주소를 입력해주세요' })
  email: string

  @IsString({ message: '비밀번호는 문자열이어야 합니다' })
  @MinLength(1, { message: '비밀번호를 입력해주세요' })
  password: string
}