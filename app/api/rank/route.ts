import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");
    const tag = searchParams.get("tag");

    // APIキーの取得（Authorizationヘッダーから）
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return NextResponse.json(
        {
          status: 401,
          error: "APIキーが必要です",
        },
        { status: 401 }
      );
    }

    // Basic認証からAPIキーを抽出
    const apiKey = atob(authHeader.replace("Basic ", ""));

    // 必須パラメータのチェック
    if (!name || !tag) {
      return NextResponse.json(
        {
          status: 400,
          error: "必要なパラメータが不足しています",
        },
        { status: 400 }
      );
    }

    try {
      // HenrikDev APIへリクエスト
      const url = `https://api.henrikdev.xyz/valorant/v2/mmr/ap/${name}/${tag}`;

      const response = await fetch(url, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            status: response.status,
            error: `外部APIエラー: ${response.statusText}`,
          },
          { status: response.status }
        );
      }

      // 外部APIからのレスポンスを解析
      const rawData = await response.json();

      // V2 API形式を従来の形式に変換
      const formattedData: {
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
      } = {
        status: rawData.status,
        data: null,
      };

      if (rawData.status === 200 && rawData.data) {
        // APIのv2形式からv1形式に互換性を持たせる変換
        formattedData.data = {
          currenttier: rawData.data.current_data?.currenttier || 0,
          currenttierpatched:
            rawData.data.current_data?.currenttierpatched || "Unranked",
          images: rawData.data.current_data?.images || {
            large: "/fallback-rank.png",
            small: "/fallback-rank.png",
            triangle_down: "/fallback-rank.png",
            triangle_up: "/fallback-rank.png",
          },
          ranking_in_tier: rawData.data.current_data?.ranking_in_tier || 0,
          mmr_change_to_last_game:
            rawData.data.current_data?.mmr_change_to_last_game || 0,
          elo: rawData.data.current_data?.elo || 0,
          name: rawData.data.name,
          tag: rawData.data.tag,
        };
      } else if (rawData.errors) {
        return NextResponse.json(
          {
            status: 404,
            error: rawData.errors[0]?.message || "データが見つかりません",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(formattedData);
    } catch {
      // 変数を完全に省略
      return NextResponse.json(
        {
          status: 500,
          error: "外部APIとの通信に失敗しました",
        },
        { status: 500 }
      );
    }
  } catch {
    // 変数を完全に省略
    return NextResponse.json(
      {
        status: 500,
        error: "サーバー内部エラー",
      },
      { status: 500 }
    );
  }
}
