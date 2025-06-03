import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import SharedNotesClient from "@/components/dashboard/shared-events/SharedNotesClient";

export default async function SharedNotesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <SharedNotesClient user={user} />;
}
