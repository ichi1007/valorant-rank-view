"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import React from "react";

// 表示用のデータ型（機密情報を含まない）
interface PublicViewData {
  clerk_name: string;
  game_name: string;
}

interface RankData {
  data: {
    currenttierpatched: string;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    images: {
      large: string;
    };
  };
}

export default function ViewComponent() {
  const { id } = useParams();
  const [publicData, setPublicData] = useState<PublicViewData | null>(null);
  const [rankData, setRankData] = useState<RankData | null>(null);

  useEffect(() => {
    if (id) {
      // 1回目のフェッチ: 公開データの取得
      fetch(`/api/data/${id}/public`)
        .then((response) => {
          if (!response.ok)
            throw new Error(`サーバーエラー: ${response.status}`);
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("JSONではないレスポンスを受信しました");
          }
          return response.json();
        })
        .then((data) => {
          setPublicData(data);
        })
        .catch((error) => {
          console.error("Error fetching public data:", error);
        });

      // 2回目のフェッチ: バックエンドでAPIキーを使用してランク情報を取得
      fetch(`/api/rank/${id}`)
        .then((response) => {
          if (!response.ok)
            throw new Error(`サーバーエラー: ${response.status}`);
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("JSONではないレスポンスを受信しました");
          }
          return response.json();
        })
        .then((data) => {
          setRankData(data);
        })
        .catch((error) => {
          console.error("Error fetching rank data:", error);
        });
    }
  }, [id]);

  return (
    <div className="p-3">
      {rankData && (
        <div className="px-4 rounded-lg max-w-[450px]">
          <div className="bg-gray-400 px-3 py-3 rounded-xl flex">
            <div>
              <Image
                src={rankData.data.images.large}
                alt=""
                width={60}
                height={60}
              />
            </div>
            <div className="w-full">
              <div className="flex items-end text-white mb-1">
                <p className="text-xl mr-5">
                  {rankData.data.currenttierpatched}
                </p>
                <p className="text-sm">{rankData.data.ranking_in_tier}/100</p>
              </div>
              <div className="relative w-full h-5 rounded-full overflow-hidden bg-gray-200 flex items-center px-3">
                {/* 増減値をプログレスバーのすぐ上中央に表示 - 微調整 */}
                <div className="absolute !-top-[0.7] left-1/2 transform -translate-x-1/2 z-20">
                  <span
                    className={`font-bold text-xs px-1.5 py-0.5 rounded shadow-sm ${
                      rankData.data.mmr_change_to_last_game >= 0
                        ? "text-green-600 bg-white/90"
                        : "text-red-600 bg-white/90"
                    }`}
                  >
                    {rankData.data.mmr_change_to_last_game >= 0 ? "+" : ""}
                    {rankData.data.mmr_change_to_last_game}
                  </span>
                </div>
                {/* プログレスバー */}
                <div className="absolute inset-0 z-10">
                  <div
                    className={`h-full ${
                      rankData.data.mmr_change_to_last_game >= 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${rankData.data.ranking_in_tier}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!publicData && !rankData && <p>Loading...</p>}
    </div>
  );
}
