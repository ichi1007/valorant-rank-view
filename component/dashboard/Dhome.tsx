import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

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

interface SavedPlayer {
  name: string;
  tag: string;
  lastUpdate: string;
}

export const Dhome = () => {
  const [gameName, setGameName] = useState("");
  const [gameId, setGameId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // LocalStorageの初期化をuseEffect内に移動
  useEffect(() => {
    const savedApiKey = localStorage.getItem("henrik_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    const savedPlayer = localStorage.getItem("saved_player");
    if (savedPlayer) {
      const { name, tag } = JSON.parse(savedPlayer) as SavedPlayer;
      setGameName(name);
      setGameId(tag);
      setIsRegistered(true);
    }
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
        const response = await fetch(`/api/rank?name=${name}&tag=${tag}`, {
          headers: {
            "X-API-Key": apiKey,
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

  // 保存済みデータの読み込みと検索を分離
  useEffect(() => {
    if (isRegistered && gameName && gameId && apiKey) {
      handleSearch(gameName, gameId);
    }
  }, [isRegistered, gameName, gameId, apiKey, handleSearch]);

  // APIキーの保存
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("henrik_api_key", apiKey);
      alert("APIキーを保存しました");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // プレイヤー情報を保存
    const playerData: SavedPlayer = {
      name: gameName,
      tag: gameId,
      lastUpdate: new Date().toISOString(),
    };
    localStorage.setItem("saved_player", JSON.stringify(playerData));
    setIsRegistered(true);

    await handleSearch(gameName, gameId);
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
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 p-2 border rounded-md dark:border-neutral-700 dark:bg-neutral-800"
                  required
                />
                <button
                  type="button"
                  onClick={saveApiKey}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  保存
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
                  onClick={() => {
                    localStorage.removeItem("saved_player");
                    setIsRegistered(false);
                    setGameName("");
                    setGameId("");
                    setRankData(null);
                  }}
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
          {loading && <div>読み込み中...</div>}
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
            <div className="text-gray-500 dark:text-gray-400">
              プレイヤーを検索してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
