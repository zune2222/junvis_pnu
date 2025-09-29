import Link from "next/link";
import { Button } from "../../shared/ui";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-gray-900 dark:text-white">
            부산대학교 학생을 위한
          </span>
          <br />
          <span className="text-blue-600">스마트 캠퍼스 앱</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          시간표와 교통정보를 자동으로 연동해서
          <br />
          지각 걱정 없는 하루를 만들어드립니다
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="md">로그인</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">회원가입</Button>
          </Link>
        </div>
        
        <div className="mt-6">
          <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            기능 살펴보기 ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
