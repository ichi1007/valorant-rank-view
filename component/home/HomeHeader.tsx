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
    <header className="w-full fixed !bg-white !z-[99999] px-2">
      <div className="flex py-5 max-w-[1000px] mx-auto justify-between items-center">
        <div className="flex flex-wrap items-end">
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
            <li className="px-3">
              <Link
                href="/contact"
                className="text-gray-500 hover:text-black transition-all"
              >
                Contact
              </Link>
            </li>
          </nav>
        </div>
        <div className="flex flex-wrap items-center">
          <SignedOut>
            <SignInButton />
            <Link
              href="/waitlist"
              className="ml-5 bg-gray-900 text-white px-5 py-[6px] rounded-md"
            >
              Join Waitlist
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="mr-5 bg-gray-900 text-white px-5 py-[6px] rounded-md"
            >
              ダッシュボード
            </Link>
            <SignOutButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
