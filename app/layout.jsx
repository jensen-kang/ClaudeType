import "./globals.css";

export const metadata = {
  title: "Claude 활용 자가진단",
  description: "Claude를 얼마나 잘 쓰고 있는지 12문항으로 진단해보세요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
