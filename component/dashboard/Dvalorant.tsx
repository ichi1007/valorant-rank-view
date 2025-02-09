import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";

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
    <div className="w-full h-48 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
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

  // UserIDをCookieから管理
  const [userId] = useState<string>(() => {
    const savedId = Cookies.get("user_id");
    if (savedId) return savedId;
    const newId = crypto.randomUUID();
    Cookies.set("user_id", newId, { expires: 365 });
    return newId;
  });

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
        const savedId = Cookies.get("user_id");
        if (!savedId) return;

        const response = await fetch(`/api/profile?userId=${savedId}`);
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
  }, []); // 初回のみ実行

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
    if (!gameName || !gameId) {
      alert("ゲーム名とIDを入力してください");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId, // UUIDを使用
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
      alert("情報を保存しました");
    } catch (error) {
      alert(error instanceof Error ? error.message : "保存に失敗しました");
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

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6">ランク情報</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左側：フォーム */}
        <div className="p-4 border rounded-lg dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">
            {isRegistered ? "プレイヤー情報編集" : "プレイヤー検索"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block mb-2 text-sm font-medium"
              >
                HenrikDev API Key
                <Link
                  href="/docs/api/valorant"
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
                  className="flex-1 p-2 border rounded-md dark:border-neutral-700 dark:bg-neutral-800"
                  required
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
                className="block mb-2 text-sm font-medium"
              >
                ゲーム名
              </label>
              <input
                type="text"
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full p-2 border rounded-md dark:border-neutral-700 dark:bg-neutral-800"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gameId"
                className="block mb-2 text-sm font-medium"
              >
                ゲームID
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full p-2 border rounded-md dark:border-neutral-700 dark:bg-neutral-800"
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
          <h2 className="text-xl font-semibold mb-4">プレビュー</h2>
          {loading && <SkeletonLoading />}
          {error && <div className="text-red-500">{error}</div>}
          {rankData && rankData.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={rankData.data.images.large}
                  alt="ランクアイコン"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-xl font-semibold">
                    {rankData.data.currenttierpatched}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ELO: {rankData.data.elo}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ランク進捗
                  </p>
                  <p className="text-lg">{rankData.data.ranking_in_tier}/100</p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    最後の変動
                  </p>
                  <p
                    className={`text-lg ${
                      rankData.data.mmr_change_to_last_game >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {rankData.data.mmr_change_to_last_game >= 0 ? "+" : ""}
                    {rankData.data.mmr_change_to_last_game}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                最終更新: {new Date().toLocaleString()}
              </p>
            </div>
          )}
          {!loading && (!rankData || !rankData.data) && !error && (
            <SkeletonLoading />
          )}
        </div>
      </div>
    </div>
  );
};
