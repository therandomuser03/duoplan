import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn />;
  }

  return (
    <div>
      <h1>Welcome to your dashboard</h1>
      <SignOutButton />
    </div>
  );
}
