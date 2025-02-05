"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div id="about" className="px-2">
      <div className="flex items-end justify-center flex-wrap">
        <h1 className="text-3xl font-bold">げーむらんくって？</h1>
        <p>あなたの配信画面を華やかにします！</p>
      </div>
      <div>
        <p className="text-center mt-3">ステップはたったの5ステップ！</p>
        <ul>
          <motion.li
            className="my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-end justify-center">
              <h1 className="text-5xl font-bold">01.</h1>
              <p className="text-3xl">ウェイトリストに参加する</p>
            </div>
            <p className="text-center mt-2">
              &quot;<span className="font-bold">ウェイトリストに登録</span>&quot;ボタンよりメールアドレスなどを入力して待機列に登録してください。
            </p>
          </motion.li>
          <motion.div
            className="flex items-end justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-[2px] h-[30px] bg-black"></div>
          </motion.div>
          <motion.li
            className="my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-end justify-center">
              <h1 className="text-5xl font-bold">02.</h1>
              <p className="text-3xl">登録メールから登録する</p>
            </div>
            <p className="text-center mt-2">
              待機列の順番が来たら、登録メールアドレスにURLが送信されるので、そちらから登録を完了してください。
            </p>
          </motion.li>
          <motion.div
            className="flex items-end justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-[2px] h-[30px] bg-black"></div>
          </motion.div>
          <motion.li
            className="my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-end justify-center">
              <h1 className="text-5xl font-bold">03.</h1>
              <p className="text-3xl">あなたのゲーム内の名前を入力する</p>
            </div>
            <p className="text-center mt-2">
              登録を完了すると自分のダッシュボードが表示されるので、必要な情報を入力してください。
            </p>
          </motion.li>
          <motion.div
            className="flex items-end justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-[2px] h-[30px] bg-black"></div>
          </motion.div>
          <motion.li
            className="my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-end justify-center">
              <h1 className="text-5xl font-bold">04.</h1>
              <p className="text-3xl">プレビュー用URLを取得する</p>
            </div>
            <p className="text-center mt-2">
              必要な情報を入力すると、プレビュー用URLが表示されるので取得してください。
            </p>
          </motion.li>
          <motion.div
            className="flex items-end justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-[2px] h-[30px] bg-black"></div>
          </motion.div>
          <motion.li
            className="my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-end justify-center">
              <h1 className="text-5xl font-bold">05.</h1>
              <p className="text-3xl">
                お好みの配信ソフトにソースとして追加する
              </p>
            </div>
            <p className="text-center mt-2">
              お好みの配信ソフトにブラウザのソースとして追加して、配信画面に配置してお使いください。
            </p>
          </motion.li>
        </ul>
      </div>
    </div>
  );
}
