// src/app/api/spaces/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Adjust path if needed

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spaceId, user_b_id } = body;

    // Validate input UUIDs (basic check)
    if (
      !spaceId ||
      !user_b_id ||
      typeof spaceId !== "string" ||
      typeof user_b_id !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid spaceId or user_b_id" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    console.log("🔐 Joining space:", { spaceId, user_b_id });

    // Step 1: Check if space exists and if it's free (user_b_id is null)
    const { data: spaceData, error: fetchError } = await supabase
      .from("spaces")
      .select("user_b_id")
      .eq("id", spaceId)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Error fetching space:", fetchError);
      return NextResponse.json(
        { error: "Error fetching space: " + fetchError.message },
        { status: 500 }
      );
    }

    if (!spaceData) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    if (spaceData.user_b_id) {
      return NextResponse.json(
        { error: "Space already joined by another user" },
        { status: 400 }
      );
    }

    // Step 2: Update space to join user
    const { data: updateData, error: updateError } = await supabase
      .from("spaces")
      .update({ user_b_id })
      .eq("id", spaceId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error updating space:", updateError);
      return NextResponse.json(
        { error: "Error updating space: " + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ space: updateData }, { status: 200 });
  } catch (err) {
    console.error("🔥 Fatal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
