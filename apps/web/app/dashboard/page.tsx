import { DashboardPage } from '../../src/pages/DashboardPage'
import { ProtectedRoute } from '../../src/shared/lib/protected-route'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '대시보드 - 준비스 (JunVIS)',
  description: '부산대학교 학생을 위한 스마트 캠퍼스 대시보드'
}