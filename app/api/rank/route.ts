import { NextResponse } from "next/server";

const API_BASE_URL = "https://api.henrikdev.xyz/valorant/v1/mmr";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const tag = searchParams.get("tag");

    // 認証ヘッダーから APIキーを取得
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "APIキーが必要です" }, { status: 401 });
    }

    // Basic認証形式からAPIキーを抽出
    const apiKey = atob(authHeader.replace("Basic ", ""));

    if (!name || !tag) {
      return NextResponse.json({
        status: 400,
        data: null,
        error: "プレイヤー名とタグが必要です",
      });
    }

    console.log(`Fetching rank data for ${name}#${tag}`);
    const response = await fetch(`${API_BASE_URL}/ap/${name}/${tag}`, {
      headers: {
        Authorization: apiKey,
      },
    });
    const data = await response.json();
    console.log("HenrikDev API Response:", data);

    if (data.status !== 200) {
      return NextResponse.json({
        status: data.status,
        data: null,
        error: data.message || "プレイヤーが見つかりませんでした",
      });
    }

    return NextResponse.json({
      status: 200,
      data: {
        ...data.data,
        currenttierpatched: data.data.currenttierpatched,
        ranking_in_tier: data.data.ranking_in_tier,
        mmr_change_to_last_game: data.data.mmr_change_to_last_game,
        images: data.data.images,
        elo: data.data.elo,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      data: null,
      error: "サーバーエラーが発生しました",
    });
  }
}
