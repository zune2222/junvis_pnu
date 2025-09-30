"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "../../features/ThemeToggle";
import { Button } from "../../shared/ui";
import { mockSchedule, mockUserInfo } from "../../shared/lib/mock-data";
import { useRouter } from "next/navigation";

interface TimetableData {
  subject: string;
  professor: string;
  time: string;
  location: string;
  id: string;
  day?: string;
}

interface UserInfo {
  studentId?: string;
  name?: string;
  major?: string;
  semester?: string;
  grade?: string;
  ip?: string;
  loginDevice?: string;
}

export default function SchedulePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [timetableData, setTimetableData] = useState<TimetableData[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [syear, setSyear] = useState("2025");
  const [termGcd, setTermGcd] = useState("120");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pnuSession = localStorage.getItem("pnuSession");
    const savedUserInfo = localStorage.getItem("pnuUserInfo");

    if (pnuSession) {
      setIsConnected(true);

      if (savedUserInfo) {
        try {
          const userInfo = JSON.parse(savedUserInfo);
          setUserInfo({
            studentId: userInfo.studentId,
            ip: userInfo.ip,
            loginDevice: userInfo.loginDevice,
            semester: "2025년 2학기",
            grade: "재학",
          });
        } catch (e) {
          console.error("저장된 사용자 정보 파싱 실패:", e);
          fetchUserInfo(); // 파싱 실패 시 API 호출
        }
      } else {
        fetchUserInfo(); // 저장된 정보가 없으면 API 호출
      }
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/pnu/userinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        console.log("👤 백엔드 사용자 정보 응답:", JSON.stringify(data, null, 2));
        console.log("👤 응답 성공 여부:", data.success);
        console.log("👤 사용자 데이터:", data.data);

        if (data.success) {
          console.log("✅ 사용자 정보 API로 설정:", data.data);
          setUserInfo(data.data);
        } else {
          console.log("❌ 사용자 정보 API 실패");
        }
      } else {
        console.log("❌ 사용자 정보 API 응답 에러:", response.status);
      }
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
    }
  };

  const fetchTimetable = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/pnu/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ syear, termGcd }),
      });

      if (!response.ok) {
        throw new Error("시간표 조회에 실패했습니다.");
      }

      const data = await response.json();

      console.log("📅 백엔드 시간표 응답:", JSON.stringify(data, null, 2));
      console.log("📅 응답 성공 여부:", data.success);
      console.log("📅 시간표 데이터:", data.data);

      // 백엔드 응답에 관계없이 더미 데이터 사용
      console.log("✅ 더미 시간표 데이터 설정");
      setTimetableData(mockSchedule);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "시간표 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePnuLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await fetch("http://localhost:4000/api/pnu/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userPw }),
      });

      if (!response.ok) {
        throw new Error("부산대 로그인에 실패했습니다.");
      }

      const data = await response.json();

      console.log("🔥 백엔드 로그인 응답:", JSON.stringify(data, null, 2));
      console.log("🔥 응답 성공 여부:", data.success);
      console.log("🔥 응답 메시지:", data.message);
      console.log("🔥 응답 데이터:", data.data);
      console.log("🔥 사용자 정보:", data.data?.userInfo);

      if (!data.success) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      // 로그인 응답에서 바로 사용자 정보 추출
      if (data.data?.userInfo) {
        console.log("✅ 사용자 정보 설정:", {
          studentId: data.data.userInfo.studentId,
          ip: data.data.userInfo.ip,
          loginDevice: data.data.userInfo.loginDevice,
        });

        setUserInfo({
          studentId: data.data.userInfo.studentId,
          ip: data.data.userInfo.ip,
          loginDevice: data.data.userInfo.loginDevice,
          semester: "2025년 2학기", // 기본값
          grade: "재학", // 기본값
        });
      } else {
        console.log("❌ 사용자 정보가 응답에 없음");
      }

      localStorage.setItem("pnuSession", "true");
      localStorage.setItem("pnuUserInfo", JSON.stringify(data.data?.userInfo || {}));
      setIsConnected(true);
      setShowLoginModal(false);
      setUserId("");
      setUserPw("");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "부산대 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const onLocationSettingClicked = (day: string) => {
    router.push(`/map?target=${day}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img src="/junvis_logo.png" alt="Junvis Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">준비스</span>
              </Link>

              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>/</span>
                <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">
                  대시보드
                </Link>
                <span>/</span>
                <span>시간표 관리</span>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📚 시간표 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">부산대학교 포털과 연동하여 시간표를 자동으로 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 포털 연동 상태 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔗 포털 연동</h3>

              {isConnected ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">연동됨</span>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                    <div className="text-sm text-green-800 dark:text-green-200 mb-2">
                      <strong>연동된 계정</strong>
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {userInfo.studentId && (
                        <>
                          학번: {userInfo.studentId}
                          <br />
                          {userInfo.semester && `학기: ${userInfo.semester}`}
                          <br />
                          {userInfo.grade && `상태: ${userInfo.grade}`}
                        </>
                      )}
                      {!userInfo.studentId && <span className="text-gray-500">사용자 정보를 불러오는 중...</span>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="sm" onClick={fetchTimetable} disabled={isLoading}>
                      {isLoading ? "🔄 불러오는 중..." : "🔄 시간표 새로고침"}
                    </Button>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={syear}
                          onChange={(e) => setSyear(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="2025">2025년</option>
                          <option value="2024">2024년</option>
                        </select>
                        <select
                          value={termGcd}
                          onChange={(e) => setTermGcd(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="120">1학기</option>
                          <option value="220">2학기</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem("pnuSession");
                        localStorage.removeItem("pnuUserInfo");
                        setIsConnected(false);
                        setTimetableData([]);
                        setUserInfo({});
                      }}
                    >
                      🔌 연동 해제
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔌</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">포털 연동이 필요해요</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      부산대학교 포털 계정으로 로그인하면
                      <br />
                      시간표를 자동으로 불러올 수 있어요
                    </p>
                    <Button className="w-full" onClick={() => setShowLoginModal(true)}>
                      포털 계정 연동하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 시간표 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📅 {syear}년 {termGcd === "120" ? "1학기" : "2학기"} 시간표
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  총 {isConnected ? timetableData.length : mockSchedule.length}과목
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {(() => {
                const scheduleData = isConnected ? timetableData : mockSchedule;
                const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                const dayNames = {
                  monday: "월요일",
                  tuesday: "화요일",
                  wednesday: "수요일",
                  thursday: "목요일",
                  friday: "금요일",
                };

                // 요일별로 그룹화
                const groupedByDay = dayOrder.reduce(
                  (acc, day) => {
                    acc[day] = scheduleData.filter((schedule) => schedule.day === day);
                    return acc;
                  },
                  {} as Record<string, typeof scheduleData>
                );

                return (
                  <div className="space-y-6">
                    {dayOrder.map((day) => (
                      <div key={day} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          {dayNames[day as keyof typeof dayNames]}
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                            ({groupedByDay[day]?.length || 0}과목)
                          </span>
                        </h4>

                        {(groupedByDay[day]?.length || 0) === 0 ? (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <div className="text-2xl mb-2">📅</div>
                            <p className="text-sm">이 날은 수업이 없어요</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {groupedByDay[day]?.map((schedule, index) => (
                              <div
                                key={schedule.id}
                                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                      {schedule.subject || `과목명 ${index + 1}`}
                                    </h5>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">👨‍🏫 {schedule.professor || "담당교수"}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <span className="flex items-center gap-1">⏰ {schedule.time || "시간 미정"}</span>
                                  <span className="flex items-center gap-1">📍 {schedule.location || "강의실 미정"}</span>
                                </div>

                                <div className="flex gap-2">
                                  {index === 0 && (
                                    <button
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                      onClick={() => onLocationSettingClicked(day)}
                                    >
                                      📍 위치 설정
                                    </button>
                                  )}
                                  <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                                    🔔 알림 설정
                                  </button>
                                  <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                                    📝 메모 추가
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <Button className="flex-1">➕ 수업 추가</Button>
                  <Button variant="secondary" className="flex-1">
                    📤 시간표 내보내기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="secondary">← 대시보드로 돌아가기</Button>
            </Link>
            <Link href="/transport">
              <Button>다음: 교통 알림 설정 →</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* 부산대 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">부산대 계정 연동</h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setUserId("");
                  setUserPw("");
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePnuLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                  <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
                </div>
              )}

              <div>
                <label htmlFor="modal-userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  학번
                </label>
                <input
                  id="modal-userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="202012345"
                />
              </div>

              <div>
                <label htmlFor="modal-userPw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  비밀번호
                </label>
                <input
                  id="modal-userPw"
                  type="password"
                  required
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400">부산대학교 원스톱 서비스 계정 정보가 필요합니다.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError("");
                    setUserId("");
                    setUserPw("");
                  }}
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "연동 중..." : "연동하기"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
