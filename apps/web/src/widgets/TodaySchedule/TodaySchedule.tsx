import { mockSchedule } from '../../shared/lib/mock-data'

export function TodaySchedule() {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  const dayMap = {
    0: 'sunday',
    1: 'monday', 
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  }
  const currentDay = dayMap[currentTime.getDay() as keyof typeof dayMap]
  const todaysSchedule = mockSchedule.filter(schedule => schedule.day === currentDay)

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
      
      {todaysSchedule.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            오늘은 수업이 없어요!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            편히 쉬시거나 다른 일정을 확인해보세요
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysSchedule.map((schedule) => {
          const scheduleHour = parseInt(schedule.time.split(':')[0] || '0')
          const isNext = scheduleHour > currentHour
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
      )}
    </div>
  )
}