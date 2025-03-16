import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { Toast } from "@/component/ui/Toast";
import { RefreshCw } from "lucide-react"; // Lucideアイコンをインポート

interface RankData {
  status: number;
  data: {
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name: string;
    tag: string;
  } | null;
}

const SkeletonLoading = () => (
  <div className="animate-pulse">
    {/* シンプルな大きな四角形 */}
    <div className="w-full h-32 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
  </div>
);

export const Dvalorant = () => {
  useUser();
  const [gameName, setGameName] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // Cookieからゲーム情報を復元
  useEffect(() => {
    const savedGameName = Cookies.get("game_name");
    const savedGameId = Cookies.get("game_id");
    const savedApiKey = Cookies.get("api_key");
    if (savedGameName) setGameName(savedGameName);
    if (savedGameId) setGameId(savedGameId);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  // Cookieにゲーム情報を保存
  const saveToLocalCookie = useCallback(() => {
    if (gameName) Cookies.set("game_name", gameName);
    if (gameId) Cookies.set("game_id", gameId);
    if (apiKey) Cookies.set("api_key", apiKey);
  }, [gameName, gameId, apiKey]);

  const handleSearch = useCallback(
    async (name: string, tag: string) => {
      if (!apiKey.trim()) {
        setError("APIキーを入力してください");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // APIキーをBase64でエンコード
        const encodedApiKey = btoa(apiKey.trim());

        const response = await fetch(`/api/rank?name=${name}&tag=${tag}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedApiKey}`,
          },
        });

        // ステータスコードをチェック
        if (!response.ok) {
          throw new Error(
            `サーバーエラー: ${response.status} - ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("JSONではないレスポンスを受信しました");
        }

        const data = await response.json();
        if (data.status !== 200) {
          throw new Error(data.error || "ランク情報の取得に失敗しました");
        }
        setRankData(data);
      } catch (err) {
        setError(`${err instanceof Error ? err.message : "不明なエラー"}`);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  ); // apiKeyを依存配列に追加

  // フォームの送信処理を修正
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName || !gameId || !apiKey) {
      showToast("全ての情報を入力してください", "error");
      return;
    }

    // Cookieに保存
    saveToLocalCookie();
    await handleSearch(gameName, gameId);
    showToast("情報を保存しました", "success");
  };

  // リフレッシュ機能を修正
  const handleRefresh = async () => {
    if (!gameName || !gameId || !apiKey) {
      showToast("プレイヤー情報が不足しています", "error");
      return;
    }
    // 一旦データをクリア
    setRankData(null);
    setLoading(true);

    try {
      await handleSearch(gameName, gameId);
      showToast("データを更新しました", "success");
    } catch {
      showToast("更新に失敗しました", "error");
    }
  };

  // クリア機能
  const handleClear = () => {
    setGameName("");
    setGameId("");
    setApiKey("");
    setRankData(null);
    Cookies.remove("game_name");
    Cookies.remove("game_id");
    Cookies.remove("api_key");
    showToast("情報をクリアしました", "success");
  };

  // URL生成関数を修正
  const generateViewUrl = useCallback(() => {
    if (!gameName || !gameId || !apiKey) return "";

    // URLクエリパラメータにデータを埋め込む
    const params = new URLSearchParams({
      game: "valorant",
      api: encodeURIComponent(apiKey),
      name: encodeURIComponent(gameName),
      id: encodeURIComponent(gameId),
    });

    return `https://game-rank.ichi10.com/view?${params.toString()}`;
  }, [gameName, gameId, apiKey]);

  // URL表示とコピー機能を修正
  const handleCopyUrl = () => {
    const url = generateViewUrl();
    if (!url) {
      showToast("プレイヤー情報が不足しています", "error");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        showToast("URLをコピーしました", "success");
      })
      .catch(() => {
        showToast("コピーに失敗しました", "error");
      });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">ランク情報</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左側：フォーム */}
        <div className="p-4 border rounded-lg dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            プレイヤー検索
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                HenrikDev API Key
                <Link
                  href="/docs/?sec=api-valorant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-600 text-xs"
                >
                  APIキーを取得
                </Link>
              </label>
              <div className="flex gap-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 p-2 border rounded-md dark:border-neutral-700 dark:bg-white"
                  required
                  autoComplete="off" // ここを追加
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {showApiKey ? "隠す" : "表示"}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="gameName"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                ゲーム名
              </label>
              <input
                type="text"
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full p-2 border rounded-md dark:border-neutral-700 dark:bg-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gameId"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                ゲームID
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full p-2 border rounded-md dark:border-neutral-700 dark:bg-white"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                検索・保存
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                クリア
              </button>
            </div>
          </form>
        </div>

        {/* 右側：プレビュー */}
        <div className="p-4 border rounded-lg dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              プレビュー
            </h2>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="更新"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {loading && <SkeletonLoading />}
          {error && <div className="text-red-500">{error}</div>}
          {rankData && rankData.data && (
            <div className="space-y-4 px-4 py-5 bg-gray-100 bg-opacity-75 rounded-lg shadow-lg">
              <div className="bg-gray-400 px-3 py-3 rounded-xl flex">
                <div>
                  {rankData.data.images?.large ? (
                    <Image
                      src={rankData.data.images.large}
                      alt="ランクアイコン"
                      width={64}
                      height={64}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/fallback-rank.png"; // 正しいパス
                        target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-[64px] h-[64px] bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-600">No Image</span>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <div className="flex items-end text-white mb-1">
                    <p className="text-xl mr-5">
                      {rankData.data.currenttierpatched}
                    </p>
                    <p className="text-sm">
                      {rankData.data.ranking_in_tier}/100
                    </p>
                  </div>
                  <div className="relative w-full h-6 rounded-full overflow-hidden bg-gray-200 flex items-center px-3">
                    {/* 増減値をプログレスバーのすぐ上中央に表示 - さらに調整 */}
                    <div className="absolute -top-[0.7] left-1/2 transform -translate-x-1/2 z-20">
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
          {!loading && (!rankData || !rankData.data) && !error && (
            <SkeletonLoading />
          )}

          <div className="w-full mt-10">
            <h3 className="text-lg">ソースURL</h3>
            <div className="flex">
              <input
                type="url"
                value={generateViewUrl()}
                className="w-[70%] border rounded-md p-2 dark:bg-neutral-700"
                readOnly
              />
              <button
                className="px-2 border rounded-xl ml-2"
                onClick={handleCopyUrl}
              >
                コピー
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ※URLにはAPIキーが含まれています。共有の際はご注意ください。
            </p>
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};
