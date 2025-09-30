import Link from 'next/link'
import { ThemeToggle } from '../../features/ThemeToggle'
import { Button } from '../../shared/ui'
import { mockTransportInfo } from '../../shared/lib/mock-data'

export default function TransportPage() {

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
                <span>교통 알림 설정</span>
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
            🚌 교통 알림 설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            부산대학교까지의 교통편을 실시간으로 확인하고 알림을 설정하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 알림 설정 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 알림 상태 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🔔 알림 상태
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      알림 활성화됨
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      수업 30분 전에 교통정보를 알려드려요
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  ⚙️ 설정 변경
                </Button>
              </div>

              {/* 알림 타이밍 설정 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  알림 타이밍
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { time: '15분 전', selected: false },
                    { time: '30분 전', selected: true },
                    { time: '45분 전', selected: false },
                    { time: '1시간 전', selected: false }
                  ].map((option) => (
                    <button
                      key={option.time}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        option.selected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="font-medium">{option.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 알림 방식 */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  알림 방식
                </h4>
                
                <div className="space-y-3">
                  {[
                    { type: '푸시 알림', icon: '📱', enabled: true },
                    { type: '이메일', icon: '📧', enabled: false },
                    { type: 'SMS', icon: '💬', enabled: false }
                  ].map((option) => (
                    <div
                      key={option.type}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option.type}
                        </span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        option.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          option.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 선호 노선 설정 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🚍 선호 노선
              </h3>
              
              <div className="space-y-4">
                {mockTransportInfo.map((bus, index) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {bus.busNumber}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {bus.busNumber}번 버스
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          → {bus.destination}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bus.status === 'onTime'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {bus.status === 'onTime' ? '정시' : '지연'}
                      </span>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          index === 0 ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <span className="text-gray-600 dark:text-gray-400">
                    ➕ 노선 추가하기
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 실시간 정보 */}
          <div className="space-y-6">
            {/* 실시간 버스 정보 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🚌 실시간 정보
              </h3>
              
              <div className="space-y-4">
                {mockTransportInfo.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {bus.busNumber}번
                      </span>
                      <span className={`text-sm font-medium ${
                        bus.status === 'onTime'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {bus.arrivalTime}분 후
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {bus.recommendation}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        📍 위치 확인
                      </button>
                      <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                        🔔 이 버스 알림 설정
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4" size="sm">
                🔄 새로고침
              </Button>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                ⚡ 빠른 액션
              </h3>
              
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="secondary" size="sm">
                  📱 버스 앱 열기
                </Button>
                <Button className="w-full justify-start" variant="secondary" size="sm">
                  🗺️ 지하철 노선도
                </Button>
                <Button className="w-full justify-start" variant="secondary" size="sm">
                  🚕 택시 호출
                </Button>
                <Button className="w-full justify-start" variant="secondary" size="sm">
                  🚴‍♂️ 따릉이 대여소
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 justify-center">
            <Link href="/schedule">
              <Button variant="secondary">
                ← 시간표 관리
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>
                대시보드로 돌아가기 →
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}