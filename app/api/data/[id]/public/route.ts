import { NextResponse } from "next/server";
import { getProfile } from "@/lib/dynamo";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const dataIndex = segments.indexOf("data");
  if (dataIndex < 0) {
    return new Response(JSON.stringify({ error: "Invalid route" }), {
      status: 400,
    });
  }
  const id = segments[dataIndex + 1];

  try {
    const profile = await getProfile(id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      clerk_name: profile.clerk_name,
      game_name: profile.game_name,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
