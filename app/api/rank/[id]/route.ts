import { NextResponse } from "next/server";
import { getProfile } from "@/lib/dynamo";

const API_BASE_URL = "https://api.henrikdev.xyz/valorant/v1/mmr";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // DynamoDBからプロフィール情報を取得
    const profile = await getProfile(id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // api_keyが存在しない場合はエラーを返す
    if (!profile.api_key) {
      return NextResponse.json({ error: "API key is not set" }, { status: 400 });
    }

    // HenrikDev APIを呼び出し
    const response = await fetch(
      `${API_BASE_URL}/ap/${profile.game_name}/${profile.game_id}`,
      {
        headers: {
          Authorization: profile.api_key,
        },
      }
    );
    const data = await response.json();

    if (data.status !== 200) {
      return NextResponse.json({
        status: data.status,
        error: data.message || "ランク情報の取得に失敗しました",
      });
    }

    // 必要なデータのみを返す
    return NextResponse.json({
      status: 200,
      data: {
        currenttierpatched: data.data.currenttierpatched,
        ranking_in_tier: data.data.ranking_in_tier,
        mmr_change_to_last_game: data.data.mmr_change_to_last_game,
        images: data.data.images,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
