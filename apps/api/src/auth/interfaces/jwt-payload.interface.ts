export interface JwtPayload {
  sub: string // 사용자 ID
  email: string
  iat?: number
  exp?: number
}