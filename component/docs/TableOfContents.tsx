"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TableItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

// 改行コードを正規化する関数
function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

// ClientMarkdown.tsxと完全に同じID生成関数を使用
function generateStableId(text: string, level: number): string {
  if (text && typeof text === "string") {
    // テキスト自体からIDを生成
    const baseId = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "")
      .replace(/^[-]+|[-]+$/g, ""); // 先頭・末尾のハイフンを除去

    // 見出しレベルをプレフィックスとして追加
    return baseId ? `h${level}-${baseId}` : `heading-empty-${level}`;
  }
  return "heading-unknown";
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tableItems, setTableItems] = useState<TableItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("No content loaded");
  // 表示用に改行コードを正規化
  const normalizedContent = content ? normalizeLineEndings(content) : "";

  // マークダウンコンテンツからヘッダー要素を抽出
  useEffect(() => {
    if (!normalizedContent) {
      setDebugInfo("Content is empty");
      return;
    }

    try {
      // マークダウンから見出しを抽出
      const lines = normalizedContent.split("\n");
      const headers: TableItem[] = [];

      lines.forEach((line) => {
        // 緩やかなパターンマッチングを使用
        const match = line.match(/^(#{1,3})\s+(.+)/);
        if (match) {
          const level = match[1].length; // #の数が階層レベル
          const text = match[2].trim();
          const id = generateStableId(text, level);

          console.log(
            `TableOfContents found heading: "${text}" -> "${id}" (Level: ${level})`
          );
          headers.push({ id, text, level });
        }
      });

      // 各見出しIDの重複を確認して一意にする
      const uniqueIds = new Set<string>();
      const uniqueHeaders = headers.map((header) => {
        let uniqueId = header.id;

        // 既に同じIDが存在する場合は連番を付与
        if (uniqueIds.has(uniqueId)) {
          let counter = 1;
          while (uniqueIds.has(`${uniqueId}-${counter}`)) {
            counter++;
          }
          uniqueId = `${uniqueId}-${counter}`;
        }

        uniqueIds.add(uniqueId);

        return {
          ...header,
          id: uniqueId,
        };
      });

      setDebugInfo(`見出し数: ${uniqueHeaders.length}`);
      setTableItems(uniqueHeaders);
    } catch (error: unknown) {
      console.error("Error parsing markdown headers:", error);
      setDebugInfo(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, [normalizedContent]);

  // スクロール時に現在の見出しをハイライト
  useEffect(() => {
    if (tableItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    // 各見出し要素を監視
    tableItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tableItems]);

  // スクロールイベント発生時に実際にDOMから要素を探して安全にスクロール
  const handleScrollToHeading = (id: string, text: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      // まずIDで要素を探す
      let element = document.getElementById(id);

      // 要素が見つからない場合、見出しテキストからIDを再生成してみる
      if (!element) {
        const newId = generateStableId(text, 1); // デフォルトのレベルを1に設定
        element = document.getElementById(newId);
        console.log(`要素 #${id} が見つからないため #${newId} を試行中`);
      }

      // もし要素が見つかった場合
      if (element) {
        const headerOffset = 100; // ヘッダーの高さに余裕を持たせる
        const elemPos = element.getBoundingClientRect().top + window.scrollY;
        const offsetPos = elemPos - headerOffset;

        window.scrollTo({
          top: offsetPos,
          behavior: "smooth",
        });
      } else {
        console.warn(`見出し "${text}" (ID: ${id}) が見つかりません`);

        // 見つからなかった場合、すべての見出し要素を探して一番近いものを見つける
        const allHeadings = document.querySelectorAll("h1, h2, h3");
        console.log("ページ内の全ての見出しID:");
        allHeadings.forEach((h) =>
          console.log(`- ${h.tagName}: "${h.textContent}" -> id="${h.id}"`)
        );
      }
    };
  };

  if (tableItems.length === 0) {
    return (
      <div className="toc-container border border-gray-200 p-4 rounded">
        <div className="toc-header">目次</div>
        <div className="text-sm text-gray-500">{debugInfo}</div>
      </div>
    );
  }

  return (
    <div className="toc-container border border-gray-200 p-4 rounded">
      <div className="toc-header">目次</div>
      <nav className="toc-nav">
        <ul>
          {tableItems.map((item, index) => (
            <li
              key={`toc-${index}`}
              className={`toc-item level-${item.level} ${
                activeId === item.id ? "active" : ""
              }`}
            >
              <Link
                href={`#${item.id}`}
                className={`toc-link ${
                  item.level === 1 ? "toc-link-main" : ""
                }`}
                onClick={handleScrollToHeading(item.id, item.text)}
              >
                {item.level === 1 && <span className="main-dot">●</span>}
                {item.level === 2 && <span className="sub-dot">○</span>}
                {item.level === 3 && <span className="sub-sub-dot">▪</span>}
                <span className="toc-text">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
