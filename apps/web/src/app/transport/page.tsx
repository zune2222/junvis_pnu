import TransportPage from '../../components/TransportPage/TransportPage'
import { ProtectedRoute } from '../../shared/lib/protected-route'

export default function Transport() {
  return (
    <ProtectedRoute>
      <TransportPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '교통정보 - 준비스 (JunVIS)',
  description: '부산대학교 학생을 위한 스마트 캠퍼스 교통정보'
}