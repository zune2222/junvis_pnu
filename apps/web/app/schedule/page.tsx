import { SchedulePage } from '../../src/pages/SchedulePage'
import { ProtectedRoute } from '../../src/shared/lib/protected-route'

export default function Schedule() {
  return (
    <ProtectedRoute>
      <SchedulePage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: '시간표 관리 - 준비스 (JunVIS)',
  description: '부산대학교 포털과 연동한 스마트 시간표 관리'
}