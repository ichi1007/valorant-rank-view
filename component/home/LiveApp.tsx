"use client";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// カスタムフックの追加
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

const steps = [
  {
    step: "1",
    title: "OBS Studioを開く",
    content: (
      <div className="space-y-2">
        <p>
          OBS
          Studioを開始します。まだインストールしていない場合は以下のリンクからダウンロードしてください。
        </p>
        <a
          href="https://obsproject.com/ja/download"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:underline gap-1"
        >
          OBS Studio
          <span className="material-symbols-outlined !text-[15px]">
            open_in_new
          </span>
        </a>
      </div>
    ),
    icon: "video_camera_front",
  },
  {
    step: "2",
    title: "ブラウザを追加",
    content: (
      <div className="space-y-2">
        <p>
          ソースの＋マークをクリックして、&quot;ブラウザ&quot;を選択します。
        </p>
        <p>新規作成で名前を付けて「OK」を押してください。</p>
      </div>
    ),
    icon: "add_circle",
  },
  {
    step: "3",
    title: "URLに追加して表示する",
    content: (
      <div className="space-y-2">
        <p>ブラウザの設定で以下の内容を入力します：</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>URLに取得したURLを入力</li>
          <li>幅を800に設定</li>
          <li>高さを600に設定</li>
        </ol>
      </div>
    ),
    icon: "link",
  },
  {
    step: "4",
    title: "お好みに配置する",
    content: (
      <div className="space-y-2">
        <p>画面上で自由に配置やサイズを調整できます：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>ALTキーを押しながら辺をドラッグでトリミング</li>
        </ul>
      </div>
    ),
    icon: "crop",
  },
];

export default function LiveApp() {
  const isMobile = useIsMobile();
  const [firstCardInView, setFirstCardInView] = useState(false);

  return (
    <div
      id="LiveApp"
      className="min-h-[80vh] flex flex-col items-center justify-center mb-10"
    >
      <div className="flex flex-wrap items-center justify-center mt-16 mb-12">
        <h1 className="text-center text-4xl font-bold mb-4 px-1">
          配信ソフトに追加する方法
        </h1>
        <p className="text-gray-600 text-lg px-1">
          OBSに追加する簡単な手順をご紹介
        </p>
      </div>

      <div className="w-full px-4 sm:px-6">
        <ScrollArea.Root className="w-full overflow-hidden">
          <ScrollArea.Viewport className="w-full whitespace-nowrap">
            <div className="flex gap-4 sm:gap-8 pb-6 px-2 justify-center">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isMobile && firstCardInView && index !== 0
                      ? { opacity: 1, y: 0 }
                      : undefined
                  }
                  whileInView={
                    !isMobile || index === 0 
                      ? { opacity: 1, y: 0 }
                      : undefined
                  }
                  onViewportEnter={() => {
                    if (index === 0) setFirstCardInView(true);
                  }}
                  viewport={{
                    once: true,
                    margin: "-100px",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: isMobile ? 0.3 : 0.3 + index * 0.1,
                  }}
                  className="w-[280px] sm:w-[340px] shrink-0 bg-white rounded-2xl p-4 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 text-xl sm:text-2xl">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-0.5 sm:mb-1">
                        Step {item.step}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                  <div className="mt-4 whitespace-normal text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="horizontal"
            className="flex h-2 sm:h-3 bg-gray-100 rounded-full mt-4 sm:mt-6 cursor-pointer"
          >
            <ScrollArea.Thumb className="bg-blue-400 rounded-full relative flex-1 hover:bg-blue-500 transition-colors" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
