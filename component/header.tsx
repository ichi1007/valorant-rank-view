import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full max-w-[1000px] flex items-center px-5 py-5 mx-auto">
      <h1>
        <Link href="/" className="text-xl font-bold">
          げーむらんく
        </Link>
      </h1>
      <nav className="list-none pl-7 hidden sm:flex items-center">
        <li className="px-3">
          <Link
            href="/docs"
            className="text-gray-500 hover:text-black transition-all"
          >
            Docs
          </Link>
        </li>
        <li className="px-3">
          <Link
            href="/blog"
            className="text-gray-500 hover:text-black transition-all"
          >
            Blog
          </Link>
        </li>
        <li className="px-3">
          <Link
            href="/sh"
            className="text-gray-500 hover:text-black transition-all"
          >
            SiteHealth
          </Link>
        </li>
      </nav>
    </header>
  );
}
