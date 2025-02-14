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
  const { user } = useUser();
  const [gameName, setGameName] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
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

  // ClerkのユーザーIDを使用
  const userId = user?.id;

  // Cookieからゲーム情報を復元
  useEffect(() => {
    const savedGameName = Cookies.get("game_name");
    const savedGameId = Cookies.get("game_id");
    if (savedGameName) setGameName(savedGameName);
    if (savedGameId) setGameId(savedGameId);
  }, []);

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
            Authorization: `Basic ${encodedApiKey}`, // APIキーをBase64エンコードして送信
          },
        });

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

  // プロフィールデータの初期取得を修正
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!userId) return;

        const response = await fetch(`/api/profile?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.profile) {
          setGameName(data.profile.game_name);
          setGameId(data.profile.game_id);
          setApiKey(data.profile.api_key || "");
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };

    fetchInitialData();
  }, [userId]); // userIdを依存配列に追加

  // ランク情報の取得を別のuseEffectで管理
  useEffect(() => {
    if (isRegistered && gameName && gameId && apiKey) {
      // すでにランクデータがある場合は再取得しない
      if (!rankData) {
        handleSearch(gameName, gameId);
      }
    }
  }, [isRegistered, gameName, gameId, apiKey, rankData, handleSearch]);

  // DynamoDBからAPIキーを取得
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const userId = `${gameName}#${gameId}`;
        const response = await fetch(`/api/apikey?userId=${userId}`);
        const data = await response.json();
        if (data.hashedApiKey) {
          setApiKey(data.hashedApiKey);
        }
      } catch (error) {
        console.error("APIキーの取得に失敗しました:", error);
      }
    };

    if (isRegistered && gameName && gameId) {
      fetchApiKey();
    }
  }, [isRegistered, gameName, gameId]);

  // 登録解除時の処理を修正
  const handleUnregister = async () => {
    try {
      if (!userId) return;

      // プロフィールを初期化
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("プロフィールの削除に失敗しました");
      }

      // 状態をリセット
      setIsRegistered(false);
      setGameName("");
      setGameId("");
      setRankData(null);
      setApiKey("");
      Cookies.remove("game_name");
      Cookies.remove("game_id");
    } catch (error) {
      console.error("登録解除に失敗しました:", error);
      alert("登録解除に失敗しました");
    }
  };

  // ゲーム情報とAPIキーを同時に保存
  const saveGameInfo = async () => {
    if (!gameName || !gameId || !userId) {
      showToast("ゲーム名とIDを入力してください", "error");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId, // ClerkのユーザーIDを使用
          clerk_name: user?.username || "anonymous",
          game_name: gameName,
          game_id: gameId,
          // APIキーは任意項目として送信
          ...(apiKey && { api_key: apiKey.trim() }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "プロフィールの保存に失敗しました");
      }

      setIsRegistered(true);
      showToast("情報を保存しました", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "保存に失敗しました",
        "error"
      );
      console.error("Save error:", error);
    }
  };

  // フォームの送信処理を修正
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveGameInfo();
    if (apiKey && gameName && gameId) {
      await handleSearch(gameName, gameId);
    }
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

  // ランク情報の取得を修正
  useEffect(() => {
    if (isRegistered && gameName && gameId && apiKey) {
      // rankDataがnullの時のみ取得
      if (!rankData) {
        handleSearch(gameName, gameId);
      }
    }
  }, [isRegistered, gameName, gameId, apiKey, rankData, handleSearch]);

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(`https://game-rank.ichi10.com/view/${userId || ''}`)
      .then(() => {
        showToast("URLをコピーしました", "success");
      })
      .catch(() => {
        showToast("コピーに失敗しました", "error");
      });
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">ランク情報</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左側：フォーム */}
        <div className="p-4 border rounded-lg dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            {isRegistered ? "プレイヤー情報編集" : "プレイヤー検索"}
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
                {isRegistered ? "更新" : "新規登録"}
              </button>
              {isRegistered && (
                <button
                  type="button"
                  onClick={handleUnregister}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  登録解除
                </button>
              )}
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
            <div className="space-y-4 p-4 bg-gray-100 bg-opacity-75 rounded-lg shadow-lg">
              <div className="bg-gray-400 px-3 py-3 rounded-xl flex">
                <div>
                  <Image
                    src={rankData.data.images.large}
                    alt=""
                    width={64}
                    height={64}
                  />
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
                    <div className="absolute inset-0 flex">
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${rankData.data.ranking_in_tier}%` }}
                      />
                      <div
                        className={`h-full flex items-center justify-center ${
                          rankData.data.mmr_change_to_last_game >= 0
                            ? "bg-[#7EFF73]"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.abs(
                            rankData.data.mmr_change_to_last_game
                          )}%`,
                        }}
                      >
                        <span className="text-xs text-black font-bold z-10">
                          {rankData.data.mmr_change_to_last_game >= 0
                            ? "+"
                            : ""}
                          {rankData.data.mmr_change_to_last_game}
                        </span>
                      </div>
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
                value={`https://game-rank.ichi10.com/view/${userId || ''}`}
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
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};
