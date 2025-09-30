import LifelogPage from '../../components/LifelogPage/LifelogPage'
import { ProtectedRoute } from '../../shared/lib/protected-route'

export default function Lifelog() {
  return (
    <ProtectedRoute>
      <LifelogPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '라이프로그 - 준비스 (JunVIS)',
  description: '부산대학교 학생을 위한 스마트 캠퍼스 라이프로그'
}
