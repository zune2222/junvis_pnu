import { TransportPage } from '../../src/pages/TransportPage'
import { ProtectedRoute } from '../../src/shared/lib/protected-route'

export default function Transport() {
  return (
    <ProtectedRoute>
      <TransportPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '교통 알림 설정 - 준비스 (JunVIS)',
  description: '부산대학교 학생을 위한 스마트 교통 알림 설정'
}