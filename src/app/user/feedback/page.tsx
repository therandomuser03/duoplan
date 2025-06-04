
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import FeedbackClient from "@/components/feedback/FeedbackClient";

export default async function FeedbackPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <FeedbackClient user={user} />;
}
