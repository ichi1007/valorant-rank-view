import type { Metadata } from "next";
import Footer from "@/component/footer";
import { ClerkProvider } from '@clerk/nextjs';
import { jaJP } from '@clerk/localizations'
import "./globals.css";

export const metadata: Metadata = {
  title: "げーむらんく | あなたの配信画面を華やかにします！",
  description: "Develop by ichi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <ClerkProvider localization={jaJP}>
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />
        </head>
        <body>
          {children}
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}
