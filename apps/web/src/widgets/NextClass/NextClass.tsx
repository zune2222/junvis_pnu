import { mockSchedule, mockTransportInfo } from '../../shared/lib/mock-data'
import { Button } from '../../shared/ui'

export function NextClass() {
  const nextClass = mockSchedule.find(s => s.status === 'upcoming')
  const recommendedBus = mockTransportInfo[0]
  
  if (!nextClass) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            오늘 수업이 모두 끝났어요!
          </h3>
          <p className="text-green-600 dark:text-green-300">
            수고하셨습니다. 편히 쉬세요 😊
          </p>
        </div>
      </div>
    )
  }

  // 다음 수업까지 남은 시간 계산 (실제로는 현재 시간과 수업 시간 비교)
  const timeUntilClass = '1시간 30분' // Mock data
  const departureTime = '08:30' // Mock data

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 다음 수업 준비
          </h3>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {nextClass.subject}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {nextClass.time} · {nextClass.location}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {timeUntilClass}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            남음
          </div>
        </div>
      </div>
      
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            💡 추천 출발 시간
          </span>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {departureTime}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
            {recommendedBus.busNumber}번
          </span>
          <span>버스 · {recommendedBus.arrivalTime}분 후 도착</span>
        </div>
        
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✅ {recommendedBus.recommendation}
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button size="sm" className="flex-1 text-sm">
          📍 길찾기
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 text-sm">
          ⏰ 알림 설정
        </Button>
      </div>
    </div>
  )
}