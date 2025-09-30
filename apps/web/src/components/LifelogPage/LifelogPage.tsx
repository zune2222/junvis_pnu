"use client";

import Link from "next/link";
import { ThemeToggle } from "../../features/ThemeToggle";
import { Button } from "../../shared/ui";
import { useState, useEffect, useRef } from "react";
import EXIF from "exif-js";
import { reverseGeocode, getSimpleAddress } from "../../shared/lib/geocoding";
import { KakaoMapManager, MapMarker } from "../../shared/lib/kakao-map";

interface LocationLog {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  arrivalTime: string;
  departureTime?: string;
  stayDuration?: number;
  isManuallyAdded: boolean;
}

interface PhotoMemory {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  takenAt?: string;
  uploadedAt: string;
  caption?: string;
  isManuallyAdded: boolean;
  tags?: string[];
}

export default function LifelogPage() {
  const [locationLogs, setLocationLogs] = useState<LocationLog[]>([]);
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const mapManagerRef = useRef<KakaoMapManager | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    checkLocationPermission();
    loadLocationLogs();
    loadPhotos();
    initializeMap();
  }, [selectedDate]);

  // 지도 초기화
  const initializeMap = async () => {
    try {
      if (!mapManagerRef.current) {
        mapManagerRef.current = new KakaoMapManager("map-container");
        await mapManagerRef.current.initializeMap();
        setIsMapLoaded(true);
      }
    } catch (error) {
      console.error("지도 초기화 실패:", error);
    }
  };

  // 지도 업데이트 (위치 로그 변경시)
  useEffect(() => {
    if (isMapLoaded && mapManagerRef.current && locationLogs.length > 0) {
      updateMap();
    }
  }, [locationLogs, isMapLoaded]);

  const updateMap = () => {
    if (!mapManagerRef.current) return;

    // 기존 마커와 선 제거
    mapManagerRef.current.clearAll();

    // 위치 로그를 시간 순서대로 정렬
    const sortedLogs = [...locationLogs].sort((a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime());

    // 마커 추가
    const mapMarkers: MapMarker[] = sortedLogs.map((log, index) => ({
      id: log.id,
      position: { lat: Number(log.latitude), lng: Number(log.longitude) },
      title: log.placeName || `위치 ${index + 1}`,
      address: log.address,
      time: formatTime(log.arrivalTime),
      isManuallyAdded: log.isManuallyAdded,
    }));

    // 마커 추가
    mapMarkers.forEach((marker) => {
      mapManagerRef.current?.addMarker(marker);
    });

    // 경로 선 그리기
    if (mapMarkers.length > 1) {
      mapManagerRef.current.drawPath(mapMarkers);
    }

    // 지도 범위 조정
    mapManagerRef.current.fitBounds(mapMarkers);
  };

  const checkLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        setPermissionStatus(permission.state);
      } catch {
        console.log("Permission API not supported");
      }
    }
  };

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        setPermissionStatus("granted");
        return position;
      } catch (error) {
        setPermissionStatus("denied");
        console.error("위치 권한이 거부되었습니다:", error);
        return null;
      }
    }
    return null;
  };

  const loadLocationLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLocationLogs([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/location-logs?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocationLogs(data);
      } else {
        console.error("위치 로그 로드 실패:", response.status);
        setLocationLogs([]);
      }
    } catch (error) {
      console.error("위치 로그를 불러오는데 실패했습니다:", error);
      setLocationLogs([]);
    }
  };

  const startTracking = async () => {
    const position = await requestLocationPermission();
    if (position) {
      setIsTracking(true);
      // TODO: 실시간 위치 추적 시작
      console.log("위치 추적 시작:", position.coords);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    // TODO: 실시간 위치 추적 중지
    console.log("위치 추적 중지");
  };

  const addManualLocation = async () => {
    const position = await requestLocationPermission();
    if (position) {
      try {
        // API 호출로 수동 위치 추가
        console.log("수동 위치 추가:", position.coords);

        // 역지오코딩으로 주소 가져오기
        let address = "현재 위치";
        try {
          console.log("수동 위치 역지오코딩 중...", position.coords.latitude, position.coords.longitude);
          const geocodedAddress = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          if (geocodedAddress && geocodedAddress !== "위치 정보 조회 실패") {
            address = geocodedAddress;
            console.log("수동 위치 역지오코딩 성공:", address);
          } else {
            address = getSimpleAddress(position.coords.latitude, position.coords.longitude);
          }
        } catch (error) {
          console.error("수동 위치 역지오코딩 실패:", error);
          address = getSimpleAddress(position.coords.latitude, position.coords.longitude);
        }

        const newLocationLog = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address,
          placeName: "수동 추가된 위치",
          arrivalTime: new Date().toISOString(),
          isManuallyAdded: true,
        };

        // API 호출로 위치 로그 저장
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/location-logs`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newLocationLog),
          });

          if (response.ok) {
            const savedLog = await response.json();
            setLocationLogs((prev) => [...prev, savedLog]);
            console.log("위치가 저장되었습니다:", savedLog);
          } else {
            console.error("위치 저장 실패:", response.status);
          }
        }
      } catch (error) {
        console.error("위치 추가에 실패했습니다:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const deleteLocationLog = async (logId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/location-logs/${logId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLocationLogs((prev) => prev.filter((log) => log.id !== logId));
        console.log("위치 로그가 삭제되었습니다:", logId);
      } else {
        console.error("위치 로그 삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("위치 로그 삭제 중 오류:", error);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
        console.log("사진이 삭제되었습니다:", photoId);
      } else {
        console.error("사진 삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("사진 삭제 중 오류:", error);
    }
  };

  const loadPhotos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPhotos([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/photos?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      } else {
        console.error("사진 로드 실패:", response.status);
        setPhotos([]);
      }
    } catch (error) {
      console.error("사진을 불러오는데 실패했습니다:", error);
      setPhotos([]);
    }
  };

  const extractEXIFData = (
    file: File
  ): Promise<{
    latitude?: number;
    longitude?: number;
    takenAt?: string;
    address?: string;
  }> => {
    return new Promise((resolve) => {
      EXIF.getData(file as any, function (this: any) {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const latRef = EXIF.getTag(this, "GPSLatitudeRef");
        const lon = EXIF.getTag(this, "GPSLongitude");
        const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
        const dateTime = EXIF.getTag(this, "DateTime");

        let latitude: number | undefined;
        let longitude: number | undefined;
        let takenAt: string | undefined;

        // GPS 좌표 변환
        if (lat && lon && latRef && lonRef) {
          latitude = convertDMSToDD(lat as number[], latRef as string);
          longitude = convertDMSToDD(lon as number[], lonRef as string);
        }

        // 촬영 시간 변환
        if (dateTime) {
          // EXIF DateTime 형식: "YYYY:MM:DD HH:mm:ss"
          const [datePart, timePart] = (dateTime as string).split(" ");
          if (datePart && timePart) {
            const [year, month, day] = datePart.split(":");
            const [hour, minute, second] = timePart.split(":");
            if (year && month && day && hour && minute && second) {
              takenAt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second)).toISOString();
            }
          }
        }

        resolve({
          latitude,
          longitude,
          takenAt,
          address: latitude && longitude ? "EXIF 위치 정보" : undefined,
        });
      });
    });
  };

  const convertDMSToDD = (dms: number[], ref: string): number => {
    let dd = (dms[0] || 0) + (dms[1] || 0) / 60 + (dms[2] || 0) / (60 * 60);
    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("EXIF 데이터 추출 중...", file.name);

      // EXIF 데이터 추출
      const exifData = await extractEXIFData(file);
      console.log("추출된 EXIF 데이터:", exifData);

      // EXIF에 위치 정보가 없으면 현재 위치 사용
      let latitude = exifData.latitude;
      let longitude = exifData.longitude;
      let address = exifData.address;

      if (!latitude || !longitude) {
        console.log("EXIF에 위치 정보가 없어 현재 위치를 사용합니다.");
        const position = await requestLocationPermission();
        if (position) {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          address = "현재 위치";
        }
      }

      // 좌표가 있으면 역지오코딩으로 주소 가져오기
      if (latitude && longitude) {
        try {
          console.log("역지오코딩 중...", latitude, longitude);
          const geocodedAddress = await reverseGeocode(latitude, longitude);
          if (geocodedAddress && geocodedAddress !== "위치 정보 조회 실패") {
            address = geocodedAddress;
            console.log("역지오코딩 성공:", address);
          } else {
            // API 실패시 간단한 주소 정보 사용
            address = getSimpleAddress(latitude, longitude);
            console.log("간단한 주소 정보 사용:", address);
          }
        } catch (error) {
          console.error("역지오코딩 실패:", error);
          address = getSimpleAddress(latitude, longitude);
        }
      }

      const photoData = {
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        latitude,
        longitude,
        address,
        takenAt: exifData.takenAt || new Date().toISOString(),
        caption: "",
        isManuallyAdded: !exifData.latitude, // EXIF 위치 정보가 있으면 자동 기록으로 처리
        tags: [],
      };

      // API 호출로 사진 메모리 저장
      const token = localStorage.getItem("token");
      if (token) {
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("latitude", latitude?.toString() || "");
        formData.append("longitude", longitude?.toString() || "");
        formData.append("address", address || "");
        formData.append("takenAt", exifData.takenAt || new Date().toISOString());
        formData.append("caption", "");
        formData.append("isManuallyAdded", (!exifData.latitude).toString());
        formData.append("tags", JSON.stringify([]));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lifelog/photos`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const savedPhoto = await response.json();
          setPhotos((prev) => [savedPhoto, ...prev]);
          console.log("사진이 저장되었습니다:", savedPhoto);
        } else {
          console.error("사진 저장 실패:", response.status);
        }
      }

      // 파일 input 초기화
      event.target.value = "";
    } catch (error) {
      console.error("사진 업로드에 실패했습니다:", error);
    }
  };

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
                <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-300">
                  대시보드
                </Link>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📍 라이프로그</h1>
          <p className="text-gray-600 dark:text-gray-400">캠퍼스에서의 하루를 자동으로 기록하고 추억해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽: 위치 추적 컨트롤 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🎯 위치 추적</h3>

              {/* 권한 상태 */}
              <div className="mb-6">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${permissionStatus === "granted" ? "bg-green-50 dark:bg-green-900/20" : permissionStatus === "denied" ? "bg-red-50 dark:bg-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}`}>
                  <div className={`w-3 h-3 rounded-full ${permissionStatus === "granted" ? "bg-green-500" : permissionStatus === "denied" ? "bg-red-500" : "bg-yellow-500"}`}></div>
                  <div>
                    <div className={`font-semibold ${permissionStatus === "granted" ? "text-green-800 dark:text-green-200" : permissionStatus === "denied" ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}>{permissionStatus === "granted" ? "위치 권한 허용됨" : permissionStatus === "denied" ? "위치 권한 거부됨" : "위치 권한 확인 필요"}</div>
                    <div className={`text-sm ${permissionStatus === "granted" ? "text-green-600 dark:text-green-400" : permissionStatus === "denied" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>{permissionStatus === "granted" ? "자동 위치 추적이 가능합니다" : permissionStatus === "denied" ? "브라우저 설정에서 위치 권한을 허용해주세요" : "위치 추적을 시작하려면 권한이 필요합니다"}</div>
                  </div>
                </div>
              </div>

              {/* 추적 컨트롤 */}
              <div className="space-y-4">
                {!isTracking ? (
                  <Button onClick={startTracking} className="w-full" disabled={permissionStatus === "denied"}>
                    🎯 위치 추적 시작
                  </Button>
                ) : (
                  <Button onClick={stopTracking} variant="secondary" className="w-full">
                    ⏹️ 추적 중지
                  </Button>
                )}

                <Button onClick={addManualLocation} variant="secondary" className="w-full" disabled={permissionStatus === "denied"}>
                  📍 현재 위치 추가
                </Button>

                <div className="mt-4">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors text-center cursor-pointer block">
                    📸 사진 업로드
                  </label>
                </div>
              </div>

              {/* 날짜 선택 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">날짜 선택</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>

          {/* 중간: 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🗺️ 이동 경로</h3>
              <div id="map-container" className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-600" style={{ minHeight: "400px" }}>
                {!isMapLoaded && <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">지도를 불러오는 중...</div>}
              </div>
            </div>
          </div>

          {/* 오른쪽: 타임라인 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📅{" "}
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })
                    : "타임라인"}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {locationLogs.length}개 기록 · {photos.length}개 사진
                </span>
              </div>

              {locationLogs.length === 0 && photos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📍</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">아직 기록이 없어요</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">위치 추적을 시작하거나 수동으로 위치를 추가해보세요</p>
                  <Button onClick={addManualLocation}>📍 첫 번째 기록 추가하기</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 위치 로그 */}
                  {locationLogs.map((log, index) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{index + 1}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{log.placeName || "알 수 없는 장소"}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{log.address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${log.isManuallyAdded ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}>{log.isManuallyAdded ? "수동 추가" : "자동 기록"}</span>
                            <button onClick={() => deleteLocationLog(log.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm" title="삭제">
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">🕐 {formatTime(log.arrivalTime)}</span>
                          {log.departureTime && <span className="flex items-center gap-1">🕕 {formatTime(log.departureTime)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 사진 메모리 */}
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                          {photo.filename ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/photos/${photo.filename}`}
                              alt={photo.originalName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // 이미지 로드 실패시 기본 아이콘 표시
                                e.currentTarget.style.display = "none";
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center" style={{ display: photo.filename ? "none" : "flex" }}>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">📸</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{photo.originalName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{photo.caption || "사진 메모리"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${photo.isManuallyAdded ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}>{photo.isManuallyAdded ? "수동 추가" : "자동 기록"}</span>
                            <button onClick={() => deletePhoto(photo.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm" title="삭제">
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">📅 {formatTime(photo.uploadedAt)}</span>
                          {photo.takenAt && photo.takenAt !== photo.uploadedAt && <span className="flex items-center gap-1">📸 {formatTime(photo.takenAt)}</span>}
                          {photo.address && <span className="flex items-center gap-1">📍 {photo.address}</span>}
                          {photo.latitude && photo.longitude && (
                            <span className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              GPS: {Number(photo.latitude).toFixed(6)}, {Number(photo.longitude).toFixed(6)}
                            </span>
                          )}
                          {photo.tags && photo.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              🏷️ {photo.tags.slice(0, 2).join(", ")}
                              {photo.tags.length > 2 && ` +${photo.tags.length - 2}`}
                            </span>
                          )}
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
              <Button variant="secondary">← 대시보드로 돌아가기</Button>
            </Link>
            <Button>다음: 사진 연동 기능 →</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
