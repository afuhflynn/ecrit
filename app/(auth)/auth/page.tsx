"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import { authClient } from "@/lib/auth-client";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        toast.success("Signed in successfully");
      }
    } catch (error) {
      toast.error("Failed to sign in");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-background border-x">
        <LoadingButton onClick={handleSignIn} loading={isLoading}>
          <Icons.google />
          Sign in with Google
        </LoadingButton>
      </main>
    </div>
  );
}
