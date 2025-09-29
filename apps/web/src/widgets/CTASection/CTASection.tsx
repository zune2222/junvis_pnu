import { Button } from '../../shared/ui'

export function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          준비스와 함께 시작하세요
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          부산대학교 학생들의 똑똑한 캠퍼스 라이프가 여기서 시작됩니다
        </p>
        <Button size="lg">
          지금 시작하기
        </Button>
      </div>
    </section>
  )
}