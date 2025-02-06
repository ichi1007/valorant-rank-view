"use client";
import Link from "next/link";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full max-w-[1000px] flex justify-between items-center px-5 py-5 mx-auto">
      <div className="flex items-end">
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
      </div>
      <div>
        <SignedOut>
          <SignInButton />
          <Link
            href="/waitlist"
            className="ml-5 bg-gray-900 text-white px-2 py-[3px] rounded-md"
          >
            Join Waitlist
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="mr-5 bg-gray-900 text-white px-2 py-[3px] rounded-md"
          >
            ダッシュボード
          </Link>
          <SignOutButton />
        </SignedIn>
      </div>
    </header>
  );
}
