import SupportClient from "@/components/dashboard/support/SupportClient";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

export default async function Support() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <SupportClient user={user} />;
}
