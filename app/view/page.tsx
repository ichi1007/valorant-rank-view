"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
  const searchParams = useSearchParams();
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankData = async () => {
      try {
        // URLから必要な情報を取得
        const game = searchParams.get("game");
        const apiKey = searchParams.get("api");
        const gameName = searchParams.get("name");
        const gameId = searchParams.get("id");

        // 必須パラメータチェック
        if (!game || !apiKey || !gameName || !gameId) {
          setError("必要な情報が不足しています");
          setLoading(false);
          return;
        }

        if (game !== "valorant") {
          setError("対応していないゲームです");
          setLoading(false);
          return;
        }

        try {
          // APIキーをエンコード
          const encodedApiKey = btoa(decodeURIComponent(apiKey));

          // APIリクエスト
          const response = await fetch(
            `/api/rank?name=${encodeURIComponent(
              gameName
            )}&tag=${encodeURIComponent(gameId)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${encodedApiKey}`,
              },
            }
          );

          // レスポンスのステータスコードをチェック
          if (!response.ok) {
            throw new Error(`サーバーエラー: ${response.status}`);
          }

          // レスポンスのContent-Typeをチェック
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("JSONではないレスポンスを受信しました");
          }

          const data = await response.json();

          if (!data || data.status !== 200 || !data.data) {
            throw new Error(data.error || "データの取得に失敗しました");
          }

          // エラーチェック: データ構造の検証
          if (!data.data.images || typeof data.data.images !== "object") {
            // 最低限必要なデータがない場合はフォールバック値を設定
            if (!data.data.images) {
              data.data.images = {
                large: "/fallback-rank.png",
              };
            }
          }

          setRankData(data);
        } catch (apiError) {
          setError(
            `API呼び出しに失敗しました: ${
              apiError instanceof Error ? apiError.message : "不明なエラー"
            }`
          );
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "不明なエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRankData();
  }, [searchParams]);

  if (loading) return <div className="p-3">Loading...</div>;
  if (error) return <div className="p-3 text-red-500">{error}</div>;

  return (
    <div className="p-3">
      {rankData && rankData.data && (
        <div className="px-4 rounded-lg max-w-[450px]">
          <div className="bg-gray-400 px-3 py-3 rounded-xl flex">
            <div>
              {rankData.data.images?.large ? (
                <Image
                  src={rankData.data.images.large}
                  alt="ランクアイコン"
                  width={60}
                  height={60}
                  onError={(e) => {
                    // 画像読み込みエラー時の処理
                    const target = e.target as HTMLImageElement;
                    target.src = "/fallback-rank.png"; // 正しいパスのフォールバック画像
                    target.onerror = null; // 無限ループ防止
                  }}
                />
              ) : (
                <div className="w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-600">No Image</span>
                </div>
              )}
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
                <div className="absolute !-top-[3.5] left-1/2 transform -translate-x-1/2 z-20">
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
    </div>
  );
}
