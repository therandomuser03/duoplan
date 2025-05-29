import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import NotesClient from "@/components/dashboard/NotesClient";

export default async function NotesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <NotesClient user={user} />;
}
