import SchedulePage from '../../components/SchedulePage/SchedulePage'
import { ProtectedRoute } from '../../shared/lib/protected-route'

export default function Schedule() {
  return (
    <ProtectedRoute>
      <SchedulePage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '시간표 - 준비스 (JunVIS)',
  description: '부산대학교 학생을 위한 스마트 캠퍼스 시간표'
}