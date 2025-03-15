"use client";

import { useState, useEffect } from "react";
import ClientMarkdown from "@/component/docs/ClientMarkdown";
import TableOfContents from "@/component/docs/TableOfContents";
import MobileMenuButton from "@/component/docs/MobileMenuButton";
import { Suspense } from "react";
// sectionsをインポートしない
import ClientSidebar from "@/component/docs/ClientSidebar";
import { SectionInfo } from "@/app/docs/page";

interface MobileMenuWrapperProps {
  section: string;
  content: string;
  error: string | null;
  sectionList: SectionInfo[];
}

export default function MobileMenuWrapper({
  section,
  content,
  error,
  sectionList,
}: MobileMenuWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // 画面サイズ変更時に自動でメニュー状態を調整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // xl breakpoint
        setIsMobileMenuOpen(false);
        setMobileTocOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 画面外クリックでメニューを閉じる
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-sidebar") && !target.closest("button")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // 画面外クリックでモバイル目次を閉じる
  useEffect(() => {
    if (!mobileTocOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-toc") && !target.closest("button")) {
        setMobileTocOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [mobileTocOpen]);

  // MarkdownContent コンポーネント
  function MarkdownContent() {
    return (
      <Suspense fallback={<div>読み込み中...</div>}>
        <ClientMarkdown content={content} />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-1 w-full max-w-7xl mx-auto pt-24 relative">
      {/* モバイルメニューボタン - 左上に配置 */}
      <div className="sm:hidden w-full px-4 py-3 border-b border-gray-200 bg-white fixed top-16 left-0 z-30 flex justify-between items-center">
        <MobileMenuButton
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isOpen={isMobileMenuOpen}
        />

        {/* セクション名を右側に表示 */}
        <span className="text-sm font-medium text-gray-600">
          {sectionList.find((s) => s.id === section)?.displayName || section}
        </span>
      </div>

      {/* スマホ画面でのコンテンツ上部余白を追加 */}
      <div className="sm:hidden h-16"></div>

      {/* スマホ - フローティング目次ボタン（右下に残す） */}
      <div className="sm:hidden fixed z-40 bottom-6 right-6">
        <button
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full shadow-lg transition-all flex items-center justify-center"
          aria-label="目次を表示"
        >
          <span className="material-symbols-outlined">toc</span>
        </button>
      </div>

      {/* モバイル用目次オーバーレイ */}
      {mobileTocOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div
            className="mobile-toc bg-white w-4/5 h-full max-w-xs overflow-y-auto ml-auto"
            style={{ height: "100%", paddingTop: "64px" }}
          >
            <div className="flex justify-between items-center px-4 pt-2 pb-2 border-b border-gray-100">
              <h3 className="font-medium">目次</h3>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* 余分な div ラッパーを削除、パディングを直接適用 */}
            <div className="p-4 pt-2">
              <TableOfContents content={content} isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* 左サイドバー - モバイル対応 */}
      <div
        className={`mobile-sidebar fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full bg-white h-full overflow-y-auto shadow-lg transition-transform duration-300 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ height: "100%", paddingTop: "64px" }}
        >
          {/* モバイルメニューヘッダー */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 mb-2">
            <h2 className="font-medium">メニュー</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 p-2"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* メニュー内容 - メニューを閉じる関数を渡す */}
          <div className="p-4 max-w-md mx-auto">
            <ClientSidebar 
              currentSection={section} 
              sectionList={sectionList}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* 左サイドバー - タブレット・デスクトップ (通常表示) */}
      <div className="hidden sm:block w-64 flex-shrink-0">
        <div className="fixed h-screen pt-20 pr-4 overflow-y-auto">
          <ClientSidebar 
            currentSection={section} 
            sectionList={sectionList} 
            // デスクトップでは不要だがonCloseMobileMenuを渡す
          />
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 mt-4 sm:mt-0">
        {/* メインコンテンツ - スクロール可能 */}
        <div className="flex-1 px-6 py-8 docs-main-content">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-4 rounded">
              {error}
            </div>
          )}
          <MarkdownContent />
          <div className="text-xs text-gray-400 mt-8">
            現在のセクション: {section}
          </div>
        </div>

        {/* 右サイドバー - 目次 (タブレット・デスクトップで表示) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 pl-4 border-l border-gray-100">
            <TableOfContents content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
