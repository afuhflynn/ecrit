import { SessionProvider } from "@/contex/session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { Modals } from "@/components/modals";

const AfterAuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  return (
    <SessionProvider value={session}>
      {children}
      <Modals />
    </SessionProvider>
  );
};

export default AfterAuthLayout;
