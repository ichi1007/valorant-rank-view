"use client";
import { motion } from "framer-motion";
import { RetroGrid } from "./retro-grid";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import SiteLogo from "@/public/げーむらんくIcon.svg";

export default function Phead() {
  return (
    <header className="relative h-[92vh] w-full overflow-hidden bg-transparent">
      <RetroGrid className="absolute inset-0" />
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="text-center z-10">
          <motion.h1
            className="text-7xl font-bold flex flex-wrap items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src={SiteLogo}
              alt="SiteLogo"
              width={100}
              height={100}
              className="pr-3"
            />
            {"げーむらんく".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.1,
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="mt-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 1 }}
          >
            配信画面にランクを表示して画面を華やかに！
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 1.3 }}
          >
            <SignedIn>
              <motion.button
                onClick={() => (window.location.href = "/dashboard")}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-3 mt-5 mx-2"
              >
                <span className="absolute inset-0 rounded-full transition-all duration-300 blur-lg group-hover:blur-xl" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100" />
                <span className="relative text-white font-semibold Aboreto tracking-wider">
                  ダッシュボードに移動
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </span>
              </motion.button>
            </SignedIn>
            <SignedOut>
              <motion.button
                onClick={() => (window.location.href = "/#waitlist")}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-3 mt-5 mx-2"
              >
                <span className="absolute inset-0 rounded-full transition-all duration-300 blur-lg group-hover:blur-xl" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100" />
                <span className="relative text-white font-semibold Aboreto tracking-wider">
                  使ってみる
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </span>
              </motion.button>
            </SignedOut>
            <motion.button
              onClick={() => (window.location.href = "/#about")}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center px-8 py-3 mt-5 mx-2"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-300 blur-lg group-hover:blur-xl" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100" />
              <span className="relative text-white font-semibold Aboreto tracking-wider">
                サービスについて知る
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-y-1">
                  ↓
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
