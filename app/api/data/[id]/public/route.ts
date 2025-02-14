import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProfile } from "@/lib/dynamo";

interface RequestContext {
  params: {
    id: string;
  };
}

export async function GET(
  req: NextRequest,
  context: RequestContext
): Promise<Response> {
  try {
    const profile = await getProfile(context.params.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

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
