import type { Metadata } from "next";
import Header from "@/component/header";
import Footer from "@/component/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "げーむらんく | あなたの配信画面を華やかにします！",
  description: "Develop by ichi10.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
