"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../shared/ui";
import { apiClient } from "../../shared/api/auth";

interface RouteData {
  busCount: number;
  subwayCount: number;
  subwayBusCount: number;
  path: PathDto[];
}

interface PathDto {
  pathId: string;
  pathType: 1 | 2 | 3;
  totalTime: number;
  totalDistance: number;
  payment: number;
  subPath: (WalkSubPath | BusSubPath | SubwaySubPath)[];
}

interface CommonSubPath {
  distance: number;
  sectionTime: number;
}

interface WalkSubPath extends CommonSubPath {
  trafficType: 3;
}

interface BusSubPath extends CommonSubPath {
  trafficType: 2;
  stationCount: number;
  stationList: string[];
  startStationID: string;
  laneList: BusLane[];
}

interface BusLane {
  laneName: string;
  laneId: string;
}

interface SubwaySubPath extends CommonSubPath {
  trafficType: 1;
  stationCount: number;
  stationList: string[];
  startStationName: string;
  laneList: SubwayLane[];
}

interface SubwayLane {
  laneName: string;
}

const TrafficTypeIcon = ({ type }: { type: number }) => {
  if (type === 1) return <span className="text-xl">🚇</span>;
  if (type === 2) return <span className="text-xl">🚌</span>;
  if (type === 3) return <span className="text-xl">🚶</span>;
  return null;
};

export default function TransportResultPage() {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findRoute = async () => {
    setIsLoading(true);
    setError(null);
    setRouteData(null);

    // 예시 좌표 (부산대 정문 -> 부산역)
    const payload = {
      start_x: 129.0403, // 부산역 경도
      start_y: 35.1149, // 부산역 위도
      end_x: 129.0794, // 부산대 정문 경도
      end_y: 35.2331, // 부산대 정문 위도
    };

    try {
      // NestJS API 서버의 URL을 사용합니다.
      const response = await apiClient.post("http://localhost:4000/api/transport/route", payload);

      setRouteData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(routeData);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/junvis_logo.png" alt="Junvis Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">준비스</span>
          </Link>
          <Link href="/transport">
            <Button variant="secondary" size="sm">
              ← 알림 설정으로
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🗺️ 경로 탐색</h1>
          <p className="text-gray-600 dark:text-gray-400">부산역에서 부산대학교까지의 경로를 탐색합니다.</p>
        </div>

        <div className="mb-6">
          <Button onClick={findRoute} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "탐색 중..." : "경로 탐색하기"}
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            <strong>오류:</strong> {error}
          </div>
        )}

        {isLoading && <div className="text-center py-10">🔄 경로를 불러오는 중입니다...</div>}

        {routeData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">탐색 결과 ({routeData.path.length}개)</h2>
            {routeData.path.map((p, index) => (
              <div
                key={p.pathId || index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">추천 경로 {index + 1}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>
                        🕒 <strong>{p.totalTime}</strong>분
                      </span>
                      <span>
                        📏 <strong>{(p.totalDistance / 1000).toFixed(1)}</strong>km
                      </span>
                    </div>
                  </div>
                  <Button size="sm">이 경로로 알림 설정</Button>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {p.subPath.map((sp, spIndex) => (
                    <div key={spIndex} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <TrafficTypeIcon type={sp.trafficType} />
                        <div className="text-xs text-gray-500 mt-1">{sp.sectionTime}분</div>
                      </div>
                      {sp.trafficType !== 3 && "laneList" in sp && sp.laneList && (
                        <div className="ml-2 px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-bold">
                          {sp.laneList[0]?.laneName}
                        </div>
                      )}
                      {spIndex < p.subPath.length - 1 && <div className="mx-3 text-gray-300 dark:text-gray-600">›</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
