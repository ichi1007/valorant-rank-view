import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProfile } from "@/lib/dynamo";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Next.js 13+のApp RouterのAPI Route型定義に準拠
export async function GET(
  request: NextRequest,
  props: Props
): Promise<NextResponse> {
  try {
    const profile = await getProfile(props.params.id);

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
