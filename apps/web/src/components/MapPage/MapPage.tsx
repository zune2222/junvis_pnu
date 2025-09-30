"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  // Naver Map 인스턴스를 저장할 state
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeMap = () => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      // 부산대학교 위치
      center: new window.naver.maps.LatLng(35.2335, 129.0781),
      zoom: 15,
      zoomControl: true,
    };

    // 생성된 지도 인스턴스를 state에 저장
    const naverMap = new window.naver.maps.Map(mapRef.current, mapOptions);
    setMap(naverMap);
  };

  const handleSetLocation = () => {
    if (!map) {
      console.error("지도가 초기화되지 않았습니다.");
      return;
    }

    // 지도의 현재 중심 좌표를 가져옴
    const center = map.getCenter();
    const target = searchParams.get("target");
    if (target) {
      console.log(target, center)
    }
  };

  const onBackClicked = () => {
    router.back();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 돌아가기 버튼 */}

      <button
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 16px",
          backgroundColor: "white",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 10,
        }}
        onClick={onBackClicked}
      >
        ← 돌아가기
      </button>

      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={initializeMap}
        onError={(e) => console.error("Naver Map Script loading error:", e)}
      />
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* 화면 중앙에 위치할 핀 아이콘 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -100%)", // 핀의 끝이 중앙에 오도록 조정
          fontSize: "2.5rem",
          pointerEvents: "none", // 핀이 지도 조작을 방해하지 않도록 설정
        }}
      >
        📍
      </div>

      {/* 현재 위치로 설정 버튼 */}
      <button
        onClick={handleSetLocation}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 14px 0 rgba(0, 118, 255, 0.39)",
          zIndex: 10,
        }}
      >
        현재 위치로 설정
      </button>
    </div>
  );
}
