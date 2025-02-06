import React from "react";

export const Dhome = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6">新規作成</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div className="p-4 border rounded-lg dark:border-neutral-700">
        <h2 className="text-xl font-semibold mb-4">ランク情報を登録</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          新規登録
        </button>
      </div>

      <div className="p-4 border rounded-lg dark:border-neutral-700"></div>
      <h2 className="text-xl font-semibold mb-4">最近の記録</h2>
      <div className="text-gray-500 dark:text-gray-400">
        まだ記録がありません
      </div>
    </div>
  );
};
