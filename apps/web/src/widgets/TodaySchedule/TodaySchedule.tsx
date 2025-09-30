import { mockSchedule } from '../../shared/lib/mock-data'

export function TodaySchedule() {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          📅 오늘의 수업
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('ko-KR', { 
            month: 'long', 
            day: 'numeric',
            weekday: 'short'
          })}
        </span>
      </div>
      
      <div className="space-y-4">
        {mockSchedule.map((schedule) => {
          const scheduleHour = parseInt(schedule.time.split(':')[0] || '0')
          const isNext = scheduleHour > currentHour && schedule.status === 'upcoming'
          const isPast = scheduleHour < currentHour
          
          return (
            <div
              key={schedule.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isNext
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  : isPast
                  ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {schedule.subject}
                </h4>
                {isNext && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    다음 수업
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  ⏰ {schedule.time}
                </span>
                <span className="flex items-center gap-1">
                  📍 {schedule.location}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                👨‍🏫 {schedule.professor}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}