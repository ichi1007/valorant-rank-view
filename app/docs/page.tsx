import { promises as fs } from "fs";
import path from "path";
import Header from "@/component/docs/DocsHeader";
import DocsSidebar from "@/component/docs/sidebar";
import ClientMarkdown from "@/component/docs/ClientMarkdown";
import TableOfContents from "@/component/docs/TableOfContents";
import { Suspense } from "react";

// 利用可能なセクション一覧を取得（静的生成用）
export async function generateStaticParams() {
  const docsDir = path.join(process.cwd(), "public/docs");

  try {
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // すべてのセクション用に静的パラメータを生成
    return mdFiles.map((file) => ({
      searchParams: { sec: file.replace(/\.md$/, "") },
    }));
  } catch (error) {
    console.error("マークダウンファイル一覧の取得に失敗しました:", error);
    return [{ searchParams: { sec: "startguide" } }];
  }
}

// メタデータの生成（SEO対応）
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sec?: string }>;
}) {
  // searchParamsをawaitして使用
  const params = await searchParams;
  const section = params?.sec || "startguide";

  // セクション名に応じたタイトルを設定
  const titles = {
    startguide: "スタートガイド",
    features: "機能紹介",
    faq: "よくある質問",
  };

  const title = titles[section as keyof typeof titles] || "ドキュメント";

  return {
    title: `${title} | げーむらんく`,
    description: `げーむらんくの${title}ページです`,
  };
}

// マークダウンの内容を取得する関数
async function getMarkdownContent(section: string = "startguide") {
  const filePath = path.join(process.cwd(), "public/docs", `${section}.md`);

  try {
    const content = await fs.readFile(filePath, "utf8");
    console.log(`Loading markdown for section: ${section}`);
    console.log(`First 100 chars: ${content.substring(0, 100)}`);

    // 最初の行が "/数字" の形式かチェックし、その場合は除外
    const lines = content.split(/\r?\n/); // 改行コードに依存しない分割
    const firstLine = lines[0].trim();
    const orderMatch = firstLine.match(/^\/\d+$/);

    // 順序指定行を除外したコンテンツを返す
    const cleanContent = orderMatch ? lines.slice(1).join("\n") : content;

    // 見出しをログに出力（デバッグ用）
    const headings = cleanContent
      .split("\n")
      .filter((line) => /^#{1,3}\s+.+/.test(line))
      .map((line) => line.trim());
    console.log(`Found ${headings.length} headings:`, headings);

    return { content: cleanContent, error: null };
  } catch (error) {
    console.error(
      `マークダウンファイルの読み込みに失敗しました: ${filePath}`,
      error
    );
    return {
      content: `# エラー\n\nMarkdownファイルの読み込みに失敗しました。\n\n以下を確認してください:\n1. publicフォルダに /docs/${section}.md ファイルが存在すること\n2. ファイルに適切なアクセス権があること`,
      error: `ファイル ${section}.md が見つかりませんでした`,
    };
  }
}

// Markdownコンテンツを表示するコンポーネント
function MarkdownContent({ content }: { content: string }) {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ClientMarkdown content={content} />
    </Suspense>
  );
}

// メインページコンポーネント
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sec?: string }>;
}) {
  // searchParamsをawaitして使用
  const params = await searchParams;
  // クエリパラメータからセクションを取得（デフォルトはstartguide）
  const section = params?.sec || "startguide";

  // 現在のセクションのコンテンツを取得
  const { content, error } = await getMarkdownContent(section);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 w-full max-w-7xl mx-auto pt-16">
        {/* 左サイドバー - ドキュメント一覧 */}
        <div className="w-64 flex-shrink-0">
          <div className="fixed h-screen pt-20 pr-4 overflow-y-auto">
            <DocsSidebar currentSection={section} />
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex flex-1">
          {/* メインコンテンツ - スクロール可能 */}
          <div className="flex-1 px-6 py-8 docs-main-content">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-4 rounded">
                {error}
              </div>
            )}
            <MarkdownContent content={content} />
            <div className="text-xs text-gray-400 mt-8">
              現在のセクション: {section}
            </div>
          </div>

          {/* 右サイドバー - 目次 */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24 pl-4 border-l border-gray-100">
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
