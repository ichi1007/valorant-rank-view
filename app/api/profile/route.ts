import { NextResponse } from "next/server";
import { deleteProfile, getProfile, saveProfile } from "@/lib/dynamo";

// GETエンドポイントを追加
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await getProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data); // デバッグログ

    // 必須項目のチェックを詳細化
    const missingFields = [];
    if (!data.id) missingFields.push("id");
    if (!data.game_name) missingFields.push("ゲーム名");
    if (!data.game_id) missingFields.push("ゲームID");
    if (!data.clerk_name) missingFields.push("ユーザー名");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `以下の項目が不足しています: ${missingFields.join(", ")}`,
          receivedData: data,
        },
        { status: 400 }
      );
    }

    // プロフィールの保存/更新
    const result = await saveProfile({
      id: data.id, // ClerkのユーザーIDを使用
      clerk_name: data.clerk_name,
      game_name: data.game_name,
      game_id: data.game_id,
      api_key: data.api_key || "", // APIキーがない場合は空文字を使用
    });

    return NextResponse.json({
      message: "プロフィールを保存/更新しました",
      success: result,
      updated: true,
    });
  } catch (error) {
    console.error("Profile save/update error:", error);
    return NextResponse.json(
      {
        error: "保存に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE エンドポイントを追加
export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { userId } = data;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteProfile(userId);
    if (!result) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
