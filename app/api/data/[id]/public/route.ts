import { NextResponse } from "next/server";
import { getProfile } from "@/lib/dynamo";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const profile = await getProfile(id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 機密情報を除外した公開データのみを返す
    const publicData = {
      clerk_name: profile.clerk_name,
      game_name: profile.game_name,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
