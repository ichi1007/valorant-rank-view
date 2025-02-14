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

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
