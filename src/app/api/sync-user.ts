// pages/api/sync-user.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client using service role (more secure for server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This must be in .env.local (do not expose to client)
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No Clerk user ID found" });
  }

  try {
    // Fetch full user info from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if user already exists in Supabase
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existing) {
      return res.status(200).json({ message: "User already exists in Supabase" });
    }

    // Insert user into Supabase
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      username: user.username || "",
      first_name: user.firstName || "",
      last_name: user.lastName || "",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      throw insertError;
    }

    res.status(200).json({ message: "User synced to Supabase" });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : String(err);
    console.error("Error syncing user:", errorMessage);
    res.status(500).json({ error: "Failed to sync user" });
  }
}
