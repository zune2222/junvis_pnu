import Link from 'next/link'
import { Button } from '../../shared/ui'

export function QuickActions() {
  const actions = [
    {
      id: '1',
      title: '시간표 관리',
      description: '수업 일정 추가 · 수정',
      icon: '📚',
      href: '/schedule',
      color: 'blue'
    },
    {
      id: '2', 
      title: '교통 알림',
      description: '버스 도착 알림 설정',
      icon: '🔔',
      href: '/transport',
      color: 'green'
    },
    {
      id: '3',
      title: '캠퍼스 맵',
      description: '강의실 위치 확인',
      icon: '🗺️',
      href: '/map',
      color: 'purple'
    },
    {
      id: '4',
      title: '설정',
      description: '앱 환경설정',
      icon: '⚙️',
      href: '/settings',
      color: 'gray'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      green: 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
      purple: 'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      gray: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        ⚡ 빠른 실행
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.id} href={action.href}>
            <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${getColorClasses(action.color)}`}>
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {action.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}