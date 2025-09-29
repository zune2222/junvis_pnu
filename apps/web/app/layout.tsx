import type { Metadata } from "next";
import { ThemeProvider } from '../src/app/providers'
import { AuthProvider } from '../src/shared/lib/auth-context'
import "./globals.css";

export const metadata: Metadata = {
  title: "준비스 (JunVIS) - 부산대학교 스마트 캠퍼스 라이프 비서",
  description: "부산대학교 학생들의 시간표와 실시간 교통 정보를 연동하여, 지각 걱정 없는 똑똑한 하루를 자동으로 설계해주는 올인원 라이프 관리 앱",
  keywords: ["부산대학교", "스마트캠퍼스", "시간표", "대중교통", "일정관리"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-pretendard antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
