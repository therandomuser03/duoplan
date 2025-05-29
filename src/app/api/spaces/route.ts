// src/app/api/spaces/route.ts

console.log("✅ [API] /api/spaces POST hit")
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // ⚠ Make sure this is in .env.local
)


const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, user_a_id } = body

    if (!name || !user_a_id) {
      return NextResponse.json({ error: "Missing name or user_a_id" }, { status: 400 })
    }

    if (!isUUID(user_a_id)) {
      return NextResponse.json({ error: "Invalid UUID format for user_a_id" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("spaces")
      .insert({ name: name.trim(), user_a_id })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ space: data }, { status: 201 })
  } catch (err) {
    console.error("Fatal error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}