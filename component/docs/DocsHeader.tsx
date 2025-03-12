import Link from "next/link";

export default function DocsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-200">
      <div className="flex py-4 max-w-6xl mx-auto px-4 md:px-6 justify-between items-center">
        <div className="flex flex-wrap items-end">
          <h1>
            <Link className="text-xl font-bold" href="/">
              げーむらんく
            </Link>
          </h1>
          <nav className="list-none pl-7 hidden sm:flex items-center">
            <li className="px-3">
              <Link
                className="text-gray-500 hover:text-black transition-all"
                href="/"
              >
                Home
              </Link>
            </li>
            <li className="px-3">
              <Link
                className="text-gray-500 hover:text-black transition-all"
                href="/blog"
              >
                Blog
              </Link>
            </li>
            <li className="px-3">
              <Link
                className="text-gray-500 hover:text-black transition-all"
                href="/sh"
              >
                SiteHealth
              </Link>
            </li>
            <li className="px-3">
              <Link
                className="text-gray-500 hover:text-black transition-all"
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </nav>
        </div>
        <div className="flex flex-wrap items-center">
          {/* ここに追加のヘッダー項目を配置 */}
        </div>
      </div>
    </header>
  );
}
