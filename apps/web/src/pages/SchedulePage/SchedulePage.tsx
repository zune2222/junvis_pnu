import Link from 'next/link'
import { ThemeToggle } from '../../features/ThemeToggle'
import { Button } from '../../shared/ui'
import { mockSchedule, mockUserInfo } from '../../shared/lib/mock-data'

export function SchedulePage() {
  const isConnected = true // Mock data - 실제로는 연동 상태 확인

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-sm">준</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">준비스</span>
              </Link>
              
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>/</span>
                <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">대시보드</Link>
                <span>/</span>
                <span>시간표 관리</span>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📚 시간표 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            부산대학교 포털과 연동하여 시간표를 자동으로 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 포털 연동 상태 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🔗 포털 연동
              </h3>
              
              {isConnected ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      연동됨
                    </span>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                    <div className="text-sm text-green-800 dark:text-green-200 mb-2">
                      <strong>연동된 계정</strong>
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      학번: {mockUserInfo.studentId}<br />
                      학과: {mockUserInfo.major}<br />
                      학기: {mockUserInfo.semester}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="sm">
                      🔄 시간표 새로고침
                    </Button>
                    <Button variant="secondary" className="w-full" size="sm">
                      ⚙️ 연동 설정
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔌</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      포털 연동이 필요해요
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      부산대학교 포털 계정으로 로그인하면<br />
                      시간표를 자동으로 불러올 수 있어요
                    </p>
                    <Button className="w-full">
                      포털 계정 연동하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 시간표 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📅 {mockUserInfo.semester} 시간표
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  총 {mockSchedule.length}과목
                </span>
              </div>
              
              <div className="space-y-4">
                {mockSchedule.map((schedule, index) => (
                  <div
                    key={schedule.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {schedule.subject}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          👨‍🏫 {schedule.professor}
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {index + 1}교시
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        ⏰ {schedule.time}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {schedule.location}
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          📍 길찾기
                        </button>
                        <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                          🔔 알림 설정
                        </button>
                        <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                          📝 메모 추가
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <Button className="flex-1">
                    ➕ 수업 추가
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    📤 시간표 내보내기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="secondary">
                ← 대시보드로 돌아가기
              </Button>
            </Link>
            <Link href="/transport">
              <Button>
                다음: 교통 알림 설정 →
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}