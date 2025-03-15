import { promises as fs } from "fs";
import path from "path";
import Header from "@/component/docs/DocsHeader";
import DocsLayout from "@/component/docs/DocsLayout";

// マークダウンファイル情報の型定義
export interface SectionInfo {
  id: string;
  order: number;
  displayName: string;
}

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

// マークダウンファイル一覧を取得する関数
async function getSectionList(): Promise<SectionInfo[]> {
  const docsDir = path.join(process.cwd(), "public/docs");

  try {
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // 各ファイルの情報を取得
    const sections = await Promise.all(
      mdFiles.map(async (file) => {
        const id = file.replace(/\.md$/, "");
        const filePath = path.join(docsDir, file);
        const content = await fs.readFile(filePath, "utf8");
        const lines = content.split("\n");

        // 順序を取得
        const firstLine = lines[0].trim();
        const orderMatch = firstLine.match(/^\/(\d+)$/);
        const order = orderMatch ? parseInt(orderMatch[1]) : 999;

        // 最初の見出しを取得
        let displayName = id; // デフォルト値はファイル名
        for (const line of lines) {
          const headingMatch = line.trim().match(/^#\s+(.+)$/);
          if (headingMatch) {
            displayName = headingMatch[1].trim();
            break;
          }
        }

        return { id, order, displayName };
      })
    );

    // 順序でソート
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("マークダウンファイル一覧の取得に失敗しました:", error);
    return [
      { id: "startguide", order: 1, displayName: "スタートガイド" },
      { id: "features", order: 2, displayName: "機能紹介" },
      { id: "faq", order: 3, displayName: "よくある質問" },
    ];
  }
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

  // 利用可能なセクション一覧を取得
  const sectionList = await getSectionList();
  console.log("利用可能なセクション:", sectionList);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* クライアントコンポーネントを使用 */}
      <DocsLayout
        section={section}
        content={content}
        error={error}
        sectionList={sectionList}
      />
    </div>
  );
}
