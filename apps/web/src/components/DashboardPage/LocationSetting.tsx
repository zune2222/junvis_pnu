import Link from "next/link";
import { Button } from "../../shared/ui";

export function LocationSetting() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">📍 내 위치 설정</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">집이나 자주 머무는 장소를 등록하여 개인화된 교통 정보를 받아보세요.</p>
      <Link href="/map?target=orig" passHref>
        <Button className="w-full">내 위치 설정하기</Button>
      </Link>
    </div>
  );
}
