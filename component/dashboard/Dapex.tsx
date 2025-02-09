import React from "react";

export const Dapex = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6">カスタマイズ設定</h1>

      <div className="space-y-6"></div>
      <div className="p-4 border rounded-lg dark:border-neutral-700">
        <h2 className="text-xl font-semibold mb-4">表示設定</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>ダークモード</span>
            <button className="w-12 h-6 bg-gray-200 rounded-full dark:bg-neutral-700">
              <div className="w-4 h-4 ml-1 bg-white rounded-full"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>通知</span>
            <button className="w-12 h-6 bg-gray-200 rounded-full dark:bg-neutral-700">
              <div className="w-4 h-4 ml-1 bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg dark:border-neutral-700"></div>
      <h2 className="text-xl font-semibold mb-4">アカウント設定</h2>
      <div className="space-y-4">
        <button className="text-red-500 hover:text-red-600 transition-colors">
          アカウントを削除
        </button>
      </div>
    </div>
  );
};
