'use client'

import Link from 'next/link'
import { ThemeToggle } from '../../features/ThemeToggle'
import { Button } from '../../shared/ui'
import { useState, useEffect } from 'react'

interface LocationLog {
  id: string
  latitude: number
  longitude: number
  address?: string
  placeName?: string
  arrivalTime: string
  departureTime?: string
  stayDuration?: number
  isManuallyAdded: boolean
}

export default function LifelogPage() {
  const [locationLogs, setLocationLogs] = useState<LocationLog[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isTracking, setIsTracking] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  useEffect(() => {
    checkLocationPermission()
    loadLocationLogs()
  }, [selectedDate])

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        setPermissionStatus(permission.state)
      } catch {
        console.log('Permission API not supported')
      }
    }
  }

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          })
        })
        setPermissionStatus('granted')
        return position
      } catch (error) {
        setPermissionStatus('denied')
        console.error('위치 권한이 거부되었습니다:', error)
        return null
      }
    }
    return null
  }

  const loadLocationLogs = async () => {
    try {
      // TODO: API 호출로 실제 데이터 가져오기
      // const response = await fetch(`/api/lifelog/location-logs?date=${selectedDate}`)
      // const data = await response.json()
      
      // Mock 데이터
      const mockData: LocationLog[] = [
        {
          id: '1',
          latitude: 35.2333,
          longitude: 129.0833,
          address: '부산광역시 금정구 부산대학로 63번길 2',
          placeName: '부산대학교 도서관',
          arrivalTime: new Date().toISOString(),
          departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          stayDuration: 120,
          isManuallyAdded: false
        },
        {
          id: '2',
          latitude: 35.2340,
          longitude: 129.0840,
          address: '부산광역시 금정구 부산대학로 63번길 2',
          placeName: '학생식당',
          arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          departureTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          stayDuration: 60,
          isManuallyAdded: false
        }
      ]
      setLocationLogs(mockData)
    } catch (error) {
      console.error('위치 로그를 불러오는데 실패했습니다:', error)
    }
  }

  const startTracking = async () => {
    const position = await requestLocationPermission()
    if (position) {
      setIsTracking(true)
      // TODO: 실시간 위치 추적 시작
      console.log('위치 추적 시작:', position.coords)
    }
  }

  const stopTracking = () => {
    setIsTracking(false)
    // TODO: 실시간 위치 추적 중지
    console.log('위치 추적 중지')
  }

  const addManualLocation = async () => {
    const position = await requestLocationPermission()
    if (position) {
      try {
        // TODO: API 호출로 수동 위치 추가
        console.log('수동 위치 추가:', position.coords)
        loadLocationLogs() // 새로고침
      } catch (error) {
        console.error('위치 추가에 실패했습니다:', error)
      }
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`
  }

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
                <span>라이프로그</span>
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
            📍 라이프로그
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            캠퍼스에서의 하루를 자동으로 기록하고 추억해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 위치 추적 컨트롤 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🎯 위치 추적
              </h3>
              
              {/* 권한 상태 */}
              <div className="mb-6">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  permissionStatus === 'granted' 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : permissionStatus === 'denied'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    permissionStatus === 'granted' 
                      ? 'bg-green-500' 
                      : permissionStatus === 'denied'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className={`font-semibold ${
                      permissionStatus === 'granted' 
                        ? 'text-green-800 dark:text-green-200' 
                        : permissionStatus === 'denied'
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {permissionStatus === 'granted' 
                        ? '위치 권한 허용됨' 
                        : permissionStatus === 'denied'
                        ? '위치 권한 거부됨'
                        : '위치 권한 확인 필요'}
                    </div>
                    <div className={`text-sm ${
                      permissionStatus === 'granted' 
                        ? 'text-green-600 dark:text-green-400' 
                        : permissionStatus === 'denied'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {permissionStatus === 'granted' 
                        ? '자동 위치 추적이 가능합니다' 
                        : permissionStatus === 'denied'
                        ? '브라우저 설정에서 위치 권한을 허용해주세요'
                        : '위치 추적을 시작하려면 권한이 필요합니다'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 추적 컨트롤 */}
              <div className="space-y-4">
                {!isTracking ? (
                  <Button 
                    onClick={startTracking}
                    className="w-full"
                    disabled={permissionStatus === 'denied'}
                  >
                    🎯 위치 추적 시작
                  </Button>
                ) : (
                  <Button 
                    onClick={stopTracking}
                    variant="secondary"
                    className="w-full"
                  >
                    ⏹️ 추적 중지
                  </Button>
                )}
                
                <Button 
                  onClick={addManualLocation}
                  variant="secondary"
                  className="w-full"
                  disabled={permissionStatus === 'denied'}
                >
                  📍 현재 위치 추가
                </Button>
              </div>

              {/* 날짜 선택 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  날짜 선택
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 타임라인 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📅 {selectedDate ? new Date(selectedDate).toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  }) : '타임라인'}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {locationLogs.length}개 기록
                </span>
              </div>
              
              {locationLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📍</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    아직 기록이 없어요
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    위치 추적을 시작하거나 수동으로 위치를 추가해보세요
                  </p>
                  <Button onClick={addManualLocation}>
                    📍 첫 번째 기록 추가하기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {locationLogs.map((log, index) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {log.placeName || '알 수 없는 장소'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {log.address}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            log.isManuallyAdded
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          }`}>
                            {log.isManuallyAdded ? '수동 추가' : '자동 기록'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            🕐 {formatTime(log.arrivalTime)}
                          </span>
                          {log.departureTime && (
                            <span className="flex items-center gap-1">
                              🕕 {formatTime(log.departureTime)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            ⏱️ {formatDuration(log.stayDuration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            <Button>
              다음: 사진 연동 기능 →
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
