#!/bin/bash

# PostgreSQL 데이터베이스 관리 스크립트

case "$1" in
  "start")
    echo "🚀 PostgreSQL 데이터베이스 시작 중..."
    docker-compose up -d postgres
    echo "✅ PostgreSQL이 시작되었습니다."
    echo "📊 데이터베이스 정보:"
    echo "   - 호스트: localhost:5432"
    echo "   - 데이터베이스: junvis_db"
    echo "   - 사용자: junvis_user"
    echo "   - 비밀번호: junvis_password"
    ;;
  "stop")
    echo "🛑 PostgreSQL 데이터베이스 중지 중..."
    docker-compose stop postgres
    echo "✅ PostgreSQL이 중지되었습니다."
    ;;
  "restart")
    echo "🔄 PostgreSQL 데이터베이스 재시작 중..."
    docker-compose restart postgres
    echo "✅ PostgreSQL이 재시작되었습니다."
    ;;
  "logs")
    echo "📋 PostgreSQL 로그 확인 중..."
    docker-compose logs -f postgres
    ;;
  "clean")
    echo "🗑️ PostgreSQL 데이터 삭제 중..."
    docker-compose down -v
    docker volume rm junvis-api_postgres_data 2>/dev/null || true
    echo "✅ 모든 데이터가 삭제되었습니다."
    ;;
  "status")
    echo "📊 PostgreSQL 상태 확인 중..."
    docker-compose ps postgres
    ;;
  *)
    echo "📖 사용법: ./scripts/db.sh [start|stop|restart|logs|clean|status]"
    echo ""
    echo "명령어:"
    echo "  start   - PostgreSQL 시작"
    echo "  stop    - PostgreSQL 중지"
    echo "  restart - PostgreSQL 재시작"
    echo "  logs    - PostgreSQL 로그 확인"
    echo "  clean   - 모든 데이터 삭제"
    echo "  status  - PostgreSQL 상태 확인"
    ;;
esac