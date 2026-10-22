import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getSessionUser } from "@/server/auth";
import { listBusinessesForUser } from "@/server/businesses";
import { UserMenu } from "./user-menu";

async function HeaderAccount() {
  const user = await getSessionUser();
  if (!user) return null;
  const businesses = await listBusinessesForUser(user.uid);
  return (
    <UserMenu
      user={{ name: user.name || user.email || "Account", email: user.email ?? null }}
      businessId={businesses[0]?.businessId}
    />
  );
}

/** Floating pill header for signed-in pages outside a business. */
export function WorkspaceHeader() {
  return (
    <header className="floating-nav fixed inset-x-4 top-4 z-50 mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full px-5 py-2 shadow-lg">
      <Link href="/dashboard" aria-label="Elevate — all businesses" className="flex items-center shrink-0 translate-y-[1.5px]">
        <Logo width={100} priority />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Suspense fallback={<div aria-hidden="true" className="size-10 rounded-full bg-active/50" />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}
