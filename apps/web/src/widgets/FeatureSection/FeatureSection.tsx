interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'green'
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600',
      iconColor: 'text-blue-600 group-hover:text-white',
      border: 'group-hover:border-blue-300 dark:group-hover:border-blue-600'
    },
    green: {
      iconBg: 'bg-green-100 dark:bg-green-900/30 group-hover:bg-green-600',
      iconColor: 'text-green-600 group-hover:text-white',
      border: 'group-hover:border-green-300 dark:group-hover:border-green-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="group">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 ${colors.border} transition-all duration-300 group-hover:shadow-xl`}>
        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
          <div className={`${colors.iconColor} transition-colors duration-300`}>
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export function FeatureSection() {
  return (
    <section id="features" className="py-32 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            핵심 기능
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            부산대학교 학생들을 위해 특별히 설계되었습니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <FeatureCard
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="AI 루틴 매니저"
            description="부산대학교 계정 연동으로 시간표를 자동 불러오고, 강의실 위치에 맞는 최적의 출발 시간을 계산해드립니다."
          />
          
          <FeatureCard
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="스마트 교통 알림"
            description="실시간 버스 도착 정보와 시간표를 연동해서 딱 맞는 타이밍에 출발 알림을 보내드립니다."
          />
        </div>
      </div>
    </section>
  )
}