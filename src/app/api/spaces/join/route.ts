// src/app/api/spaces/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the same Supabase client configuration as your create route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // ⚠ Make sure this is in .env.local
);

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const spaceId = body.spaceId?.trim();
    const user_b_id = body.user_b_id?.trim();

    console.log("🧪 Checking spaceId match:", `'${spaceId}'`);
    console.log("🚨 Incoming spaceId from client:", spaceId);
    console.log("🙋‍♂️ Joining user_b_id:", user_b_id);

    // Validate input UUIDs
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

    // Validate UUID format
    if (!isUUID(spaceId) || !isUUID(user_b_id)) {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 }
      );
    }

    console.log("🔐 Joining space:", { spaceId, user_b_id });

    // Step 1: Check if space exists and if it's free (user_b_id is null)
    const { data: spaceData, error: fetchError } = await supabase
      .from("spaces")
      .select("user_b_id, name, user_a_id")
      .eq("id", spaceId)
      .limit(1)
      .maybeSingle();

    console.log("🔍 supabase response:", { spaceData, fetchError });

    if (fetchError) {
      console.error("❌ Error fetching space:", fetchError);
      return NextResponse.json(
        { error: "Error fetching space: " + fetchError.message },
        { status: 500 }
      );
    }

    if (!spaceData) {
      console.log("🚨 spaceData is null or undefined:", spaceData);
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    // Check if user is trying to join their own space
    if (spaceData.user_a_id === user_b_id) {
      return NextResponse.json(
        { error: "Cannot join your own space" },
        { status: 400 }
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

    console.log("✅ Successfully joined space:", updateData);
    return NextResponse.json({ space: updateData }, { status: 200 });
  } catch (err) {
    console.error("🔥 Fatal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}