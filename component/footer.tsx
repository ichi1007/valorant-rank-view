import Link from "next/link";

export default function Footer() {
  return (
    <div id="footer">
      <div className="bg-gray-100 border-t px-5 py-8">
        <ul className="w-full max-w-[1000px] mx-auto text-xs px-4">
          <li>
            VALORANT及びライアットゲームズは、
            <Link
              href="https://www.riotgames.com/"
              className="underline"
              target="_blank"
            >
              Riot Games
            </Link>
            , Inc.の商標又は登録商標です。
          </li>
          <li>
            VALORANT ©{" "}
            <Link
              href="https://www.riotgames.com/"
              className="underline"
              target="_blank"
            >
              Riot Games
            </Link>
            , Inc.
          </li>
          <li>
            本ページで使用しているAPIは ©{" "}
            <Link
              href="https://www.riotgames.com/"
              className="underline"
              target="_blank"
            >
              Riot Games
            </Link>
            , Inc. が公式に提供しているものを使用しております。
          </li>
        </ul>
      </div>
      <footer className="w-full bg-white border-t text-black text-center py-5 text-sm">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link href="https://ichi10.com" target="_blank">ichi</Link>, Dev.
        </p>
      </footer>
    </div>
  );
}
