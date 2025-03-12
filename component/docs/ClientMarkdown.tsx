"use client";

import { memo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// rehypeSlugを削除しID生成を自分で制御する
import { Components } from "react-markdown/lib/ast-to-react";

interface ClientMarkdownProps {
  content: string;
}

// 改行コードを正規化する関数
function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

// 共通ID生成関数（両方のコンポーネントで同一の実装を使用）
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

// すべての見出しとIDをグローバルに保持
const HEADING_MAP = new Map<string, string>();

// WindowにHEADING_MAP型を拡張する
declare global {
  interface Window {
    HEADING_MAP?: Map<string, string>;
  }
}

function ClientMarkdownComponent({ content }: ClientMarkdownProps) {
  // 改行コードを正規化
  const normalizedContent = normalizeLineEndings(content);

  // コンポーネントマウント時に見出しを解析してIDマップを作成

  useEffect(() => {
    // マップをクリア
    HEADING_MAP.clear();

    const lines = normalizedContent.split("\n");
    // 見出し行を抽出
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateStableId(text, level);

        // グローバルマップに追加
        HEADING_MAP.set(text, id);
        console.log(
          `ClientMarkdown stored ID: "${text}" -> "${id}" (Level: ${level})`
        );
      }
    });

    // グローバル変数に拡張してTableOfContentsからアクセス可能にする
    if (typeof window !== "undefined") {
      window.HEADING_MAP = HEADING_MAP;
    }
  }, [normalizedContent]);

  // カスタムコンポーネントの定義
  const components: Components = {
    h1: ({ children, ...props }) => {
      const text =
        typeof children === "string" ? children : String(children || "");
      const id = generateStableId(text, 1);

      console.log(`ClientMarkdown rendering h1: "${text}" with id: "${id}"`);

      return (
        <h1 id={id} {...props}>
          {children}
          {id && (
            <a href={`#${id}`} className="anchor-link">
              <span className="anchor-icon">#</span>
            </a>
          )}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const text =
        typeof children === "string" ? children : String(children || "");
      const id = generateStableId(text, 2);

      return (
        <h2 id={id} {...props}>
          {children}
          {id && (
            <a href={`#${id}`} className="anchor-link">
              <span className="anchor-icon">#</span>
            </a>
          )}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const text =
        typeof children === "string" ? children : String(children || "");
      const id = generateStableId(text, 3);

      return (
        <h3 id={id} {...props}>
          {children}
          {id && (
            <a href={`#${id}`} className="anchor-link">
              <span className="anchor-icon">#</span>
            </a>
          )}
        </h3>
      );
    },
  } as Components;

  return (
    <div className="markdown-body prose max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

// 入力が変わらなければ再レンダリングしないよう最適化
export default memo(ClientMarkdownComponent, (prevProps, nextProps) => {
  return (
    normalizeLineEndings(prevProps.content) ===
    normalizeLineEndings(nextProps.content)
  );
});
