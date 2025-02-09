import { NextResponse } from "next/server";
import { deleteApiKey, getProfile, updateApiKey } from "@/lib/dynamo";

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
    console.log("Retrieved profile:", { ...profile, api_key: "***masked***" });

    if (!profile) {
      return NextResponse.json(
        { message: "No profile found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, apiKey } = await request.json();

    if (!userId || !apiKey) {
      return NextResponse.json(
        { error: "User ID and API key are required" },
        { status: 400 }
      );
    }

    try {
      await updateApiKey(userId, apiKey);
      return NextResponse.json({ message: "API key updated successfully" });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "プロフィールが見つかりません"
      ) {
        return NextResponse.json(
          { error: "先にプロフィール情報を保存してください" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update API key",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteApiKey(userId);
    if (!result) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "API key deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete API Key Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete API key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
