"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Phead() {
  return (
    <header className="h-[92vh] w-full flex items-center justify-center flex-wrap">
      <div className="text-center">
        <motion.h1
          className="text-7xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
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
          className="mt-5 flex flex-wrap justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 1.3 }}
        >
          <Link
            href="/dashboard"
            className="border-2 border-black text-black text-md font-bold rounded-[1000px] px-5 py-2 mx-2 my-1 hover:bg-black hover:text-white transition-all"
          >
            サービスを使用する↗
          </Link>
          <Link
            href="/#about"
            className="border-2 border-black text-black text-md font-bold rounded-[1000px] px-5 py-2 mx-2 my-1 hover:bg-black hover:text-white transition-all"
          >
            サービスについて知る↓
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
