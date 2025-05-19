// Replace the entire content of app/space/[id]/page.tsx with this:

import { Space } from "@/components/space";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// Remove all TypeScript interfaces and let Next.js handle the types
export default async function SpacePage({ params }) {
  // Use a try-catch block to handle errors
  try {
    if (!params || !params.id) {
      return notFound();
    }

    const spaceId = params.id;

    // Validate the space ID exists
    const { data: space, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", spaceId)
      .single();

    if (error || !space) {
      return notFound();
    }

    // Render the space component
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Space: {spaceId}</h1>
        <Space spaceId={spaceId} onClose={() => {}} />
      </div>
    );
  } catch (err) {
    console.error("Error loading space:", err);
    return notFound();
  }
}