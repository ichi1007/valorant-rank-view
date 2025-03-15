"use client";

import Link from "next/link";
import { SectionInfo } from "@/app/docs/page";

interface ClientSidebarProps {
  currentSection?: string;
  sectionList: SectionInfo[];
  onCloseMobileMenu?: () => void; // メニューを閉じる関数をpropsとして追加
}

// フォールバック用のデフォルトリスト
const defaultSections = [
  { id: "startguide", order: 1, displayName: "スタートガイド" },
  { id: "features", order: 2, displayName: "機能紹介" },
  { id: "faq", order: 3, displayName: "よくある質問" },
  { id: "table-example", order: 4, displayName: "テーブル例" },
];

export default function ClientSidebar({
  currentSection = "startguide",
  sectionList = defaultSections,
  onCloseMobileMenu, // 親コンポーネントから渡されるメニュー閉じる関数
}: ClientSidebarProps) {
  // サーバーから渡されたセクション一覧があれば使用、なければデフォルト
  const sections = sectionList.length > 0 ? sectionList : defaultSections;

  return (
    <ul className="w-full">
      {sections.map((section, index) => (
        <li
          key={section.id}
          className="mb-3"
          style={{ "--item-index": index } as React.CSSProperties}
        >
          <Link
            className={`${
              currentSection === section.id
                ? "text-blue-600 font-medium"
                : "text-black"
            } hover:underline block py-1 text-lg`}
            href={`/docs?sec=${section.id}`}
            onClick={() => {
              // メニュー項目クリック時に自動的にメニューを閉じる
              if (onCloseMobileMenu && section.id !== currentSection) {
                onCloseMobileMenu();
              }
            }}
          >
            {section.displayName}
          </Link>
        </li>
      ))}
    </ul>
  );
}
