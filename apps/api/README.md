# 준비스 (JunVIS) API

부산대학교 학생을 위한 스마트 캠퍼스 라이프 어시스턴트 백엔드 API

## 🚀 빠른 시작

### 1. 데이터베이스 실행

```bash
# PostgreSQL Docker 컨테이너 시작
npm run db:start

# 데이터베이스 상태 확인
npm run db:status
```

### 2. API 서버 실행

```bash
# 개발 서버 시작 (데이터베이스 자동 시작 + API 서버)
npm run dev

# 또는 API 서버만 시작
npm run start:dev
```

### 3. API 테스트

```bash
# 회원가입
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pusan.ac.kr",
    "password": "password123",
    "name": "테스트 학생",
    "studentId": "2024123456",
    "major": "컴퓨터공학과"
  }'

# 로그인
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pusan.ac.kr",
    "password": "password123"
  }'
```

## 📊 데이터베이스 관리

```bash
# 데이터베이스 시작
npm run db:start

# 데이터베이스 중지
npm run db:stop

# 데이터베이스 재시작
npm run db:restart

# 로그 확인
npm run db:logs

# 모든 데이터 삭제 (주의!)
npm run db:clean

# 상태 확인
npm run db:status
```

## 🔌 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회 (인증 필요)

## 🗃️ 데이터베이스 정보

- **호스트**: localhost:5432
- **데이터베이스**: junvis_db
- **사용자**: junvis_user
- **비밀번호**: junvis_password

## 🛠️ 기술 스택

- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Container**: Docker Compose