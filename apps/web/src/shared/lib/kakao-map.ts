// 카카오 지도 API 유틸리티

declare global {
  interface Window {
    kakao: any;
  }
}

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  address?: string;
  time: string;
  isManuallyAdded: boolean;
}

export class KakaoMapManager {
  private map: any = null;
  private markers: any[] = [];
  private polylines: any[] = [];
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  // 카카오 지도 API 로드
  static loadKakaoMapAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY || "your_kakao_api_key_here"}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve();
        });
      };
      script.onerror = () => {
        reject(new Error("카카오 지도 API 로드 실패"));
      };
      document.head.appendChild(script);
    });
  }

  // 지도 초기화
  async initializeMap(centerLat: number = 35.2333, centerLng: number = 129.0833): Promise<void> {
    await KakaoMapManager.loadKakaoMapAPI();

    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`지도 컨테이너를 찾을 수 없습니다: ${this.containerId}`);
    }

    const options = {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level: 3,
    };

    this.map = new window.kakao.maps.Map(container, options);
  }

  // 마커 추가
  addMarker(markerData: MapMarker): void {
    if (!this.map) return;

    const position = new window.kakao.maps.LatLng(markerData.position.lat, markerData.position.lng);

    // 마커 이미지 설정
    const imageSrc = markerData.isManuallyAdded ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";

    const imageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
    });

    // 인포윈도우 생성
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="padding: 10px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 5px;">${markerData.title}</div>
          ${markerData.address ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">${markerData.address}</div>` : ""}
          <div style="font-size: 12px; color: #999;">${markerData.time}</div>
        </div>
      `,
    });

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });

    marker.setMap(this.map);
    this.markers.push(marker);
  }

  // 경로 선 그리기
  drawPath(markers: MapMarker[]): void {
    if (!this.map || markers.length < 2) return;

    // 기존 선 제거
    this.clearPath();

    const points = markers.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).map((marker) => new window.kakao.maps.LatLng(marker.position.lat, marker.position.lng));

    const polyline = new window.kakao.maps.Polyline({
      path: points,
      strokeWeight: 3,
      strokeColor: "#FF6B6B",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });

    polyline.setMap(this.map);
    this.polylines.push(polyline);
  }

  // 모든 마커와 선 제거
  clearAll(): void {
    this.clearMarkers();
    this.clearPath();
  }

  // 마커 제거
  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  // 경로 선 제거
  clearPath(): void {
    this.polylines.forEach((polyline) => polyline.setMap(null));
    this.polylines = [];
  }

  // 지도 중심 이동
  setCenter(lat: number, lng: number): void {
    if (!this.map) return;
    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    this.map.setCenter(moveLatLon);
  }

  // 지도 레벨 변경
  setLevel(level: number): void {
    if (!this.map) return;
    this.map.setLevel(level);
  }

  // 모든 마커가 보이도록 지도 범위 조정
  fitBounds(markers: MapMarker[]): void {
    if (!this.map || markers.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend(new window.kakao.maps.LatLng(marker.position.lat, marker.position.lng));
    });

    this.map.setBounds(bounds);
  }
}
