// 카카오 API를 이용한 역지오코딩 유틸리티

interface KakaoAddressResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      mountain_yn: string;
      main_address_no: string;
      sub_address_no: string;
    };
    road_address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: string;
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
    };
  }>;
}

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  // 카카오 API 키 (실제 사용시에는 환경변수에서 가져와야 함)
  const API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY || "your_kakao_api_key_here";

  if (API_KEY === "your_kakao_api_key_here" || !API_KEY || API_KEY.length < 10) {
    console.warn("카카오 API 키가 설정되지 않았거나 유효하지 않습니다. 기본 주소를 반환합니다.");
    return getSimpleAddress(latitude, longitude);
  }

  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KakaoAddressResponse = await response.json();

    if (data.documents && data.documents.length > 0) {
      const document = data.documents[0];

      // 도로명 주소가 있으면 우선 사용, 없으면 지번 주소 사용
      if (document?.road_address) {
        return document.road_address.address_name;
      } else if (document?.address) {
        return document.address.address_name;
      }
    }

    return "알 수 없는 위치";
  } catch (error) {
    console.error("역지오코딩 실패:", error);
    // API 실패시 간단한 주소 정보 반환
    return getSimpleAddress(latitude, longitude);
  }
};

// 좌표로부터 간단한 주소 정보 추출 (API 없이)
export const getSimpleAddress = (latitude: number, longitude: number): string => {
  // 부산대학교 근처 좌표 범위 체크
  const pnuLat = 35.2333;
  const pnuLng = 129.0833;
  const tolerance = 0.01; // 약 1km

  if (Math.abs(latitude - pnuLat) < tolerance && Math.abs(longitude - pnuLng) < tolerance) {
    return "부산대학교 캠퍼스";
  }

  // 부산 지역 좌표 범위 체크
  const busanLat = 35.1796;
  const busanLng = 129.0756;
  const busanTolerance = 0.1; // 약 10km

  if (Math.abs(latitude - busanLat) < busanTolerance && Math.abs(longitude - busanLng) < busanTolerance) {
    return "부산광역시";
  }

  return `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}`;
};
