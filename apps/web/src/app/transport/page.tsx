import TransportResultPage from "../../components/TransportPage/TransportResultPage";
import { ProtectedRoute } from "../../shared/lib/protected-route";

export default function TransportResult() {
  return (
    <ProtectedRoute>
      <TransportResultPage />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "경로 탐색 결과 - 준비스 (JunVIS)",
  description: "부산대학교 학생을 위한 스마트 캠퍼스 경로 탐색 결과",
};
