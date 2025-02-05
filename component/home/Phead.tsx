"use client";
import { motion, AnimatePresence } from "framer-motion";
import { RetroGrid } from "./retro-grid";
import { Waitlist } from "@clerk/nextjs";
import { useState } from "react";

export default function Phead() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="relative h-[92vh] w-full overflow-hidden">
        <RetroGrid className="absolute inset-0" />
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="text-center z-10">
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
              className="flex flex-wrap justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 1.3 }}
            >
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-3 mt-5 mx-2"
              >
                <span className="absolute inset-0 rounded-full transition-all duration-300 blur-lg group-hover:blur-xl" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100" />
                <span className="relative text-white font-semibold Aboreto tracking-wider">
                  ウェイトリストに登録
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </span>
              </motion.button>
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

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">ウェイトリストに登録</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <Waitlist />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
