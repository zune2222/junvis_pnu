import Link from 'next/link'
import { ThemeToggle } from '../../features/ThemeToggle'
import { TodaySchedule } from '../../widgets/TodaySchedule'
import { NextClass } from '../../widgets/NextClass'
import { TransportStatus } from '../../widgets/TransportStatus'
import { QuickActions } from '../../widgets/QuickActions'
import { mockUserInfo } from '../../shared/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-sm">준</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">준비스</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>/</span>
                <span>대시보드</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockUserInfo.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mockUserInfo.major} · {mockUserInfo.semester}
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            안녕하세요, {mockUserInfo.name}님! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            오늘도 똑똑한 캠퍼스 라이프를 준비했어요
          </p>
        </div>

        {/* 대시보드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 다음 수업 정보 */}
            <NextClass />
            
            {/* 오늘의 시간표 */}
            <TodaySchedule />
          </div>
          
          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 실시간 교통정보 */}
            <TransportStatus />
            
            {/* 빠른 실행 */}
            <QuickActions />
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-center"
            >
              📚 시간표 관리하기
            </Link>
            <Link
              href="/transport" 
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-medium transition-colors text-center"
            >
              🔔 알림 설정하기
            </Link>
            <Link
              href="/lifelog" 
              className="px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl font-medium transition-colors text-center"
            >
              📍 라이프로그 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}