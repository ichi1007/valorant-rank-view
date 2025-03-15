"use client";

import dynamic from "next/dynamic";
import { SectionInfo } from "@/app/docs/page";

// クライアントサイドのみでレンダリングされるコンポーネント
const MobileMenuWrapper = dynamic(
  () => import("@/component/docs/MobileMenuWrapper"),
  { ssr: false }
);

interface DocsLayoutProps {
  section: string;
  content: string;
  error: string | null;
  sectionList: SectionInfo[];
}

export default function DocsLayout({
  section,
  content,
  error,
  sectionList,
}: DocsLayoutProps) {
  return (
    <MobileMenuWrapper
      section={section}
      content={content}
      error={error}
      sectionList={sectionList}
    />
  );
}
