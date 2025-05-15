// components/AuthModal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SignIn, SignUp } from "@clerk/nextjs"

export function AuthModal({
  mode = "sign-in",
  open,
  onOpenChange
}: {
  mode?: "sign-in" | "sign-up";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle>{mode === "sign-in" ? "Log In" : "Sign Up"}</DialogTitle>
        </DialogHeader>
        {mode === "sign-in" ? <SignIn /> : <SignUp />}
      </DialogContent>
    </Dialog>
  );
}
