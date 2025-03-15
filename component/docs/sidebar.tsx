// クライアントコンポーネントの指定を削除（デフォルトでサーバーコンポーネント）
import Link from "next/link";

interface DocsSidebarProps {
  currentSection?: string;
}

// セクション情報の型定義
interface SectionInfo {
  id: string;
  order: number;
  displayName: string;
}

// サーバーコンポーネントとして定義
export default async function DocsSidebar({
  currentSection = "startguide",
}: DocsSidebarProps) {
  // サーバーサイドでの処理（Next.jsのビルド時または要求時に実行される）
  const sections = await getAvailableSections();

  return (
    <ul className="w-full">
      {sections.map((section) => (
        <li key={section.id} className="mb-3">
          <Link
            className={`${
              currentSection === section.id
                ? "text-blue-600 font-medium"
                : "text-black"
            } hover:underline block py-1`}
            href={`/docs?sec=${section.id}`}
          >
            {section.displayName}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 以下のインポートはサーバーサイドのみで実行される
// クライアントバンドルに含まれない
import { promises as fs } from "fs";
import path from "path";

// 利用可能なセクション一覧を動的に取得
async function getAvailableSections(): Promise<SectionInfo[]> {
  const docsDir = path.join(process.cwd(), "public/docs");

  try {
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // 各ファイルの順序情報と見出しを取得
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

        // 最初の見出し（# タイトル）を探す
        let displayName = getSectionDisplayName(id); // デフォルト値
        for (const line of lines) {
          const headingMatch = line.trim().match(/^#\s+(.+)$/);
          if (headingMatch) {
            displayName = headingMatch[1].trim();
            break;
          }
        }

        return {
          id,
          order,
          displayName,
        };
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

// セクション名を表示名に変換 (フォールバック用)
function getSectionDisplayName(section: string): string {
  const displayNames: Record<string, string> = {
    startguide: "スタートガイド",
    features: "機能紹介",
    faq: "よくある質問",
  };

  return displayNames[section] || section;
}
