'use client'

import Link from 'next/link'
import { ThemeToggle } from '../../features/ThemeToggle'
import { Button } from '../../shared/ui'
import { useAuth } from '../../shared/lib/auth-context'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">준</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">준비스</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  대시보드
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.name}님
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={logout}
                  >
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}