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
    <header className="floating-nav fixed inset-x-3 sm:inset-x-5 top-3 sm:top-5 z-50 mx-auto flex h-14 sm:h-16 max-w-[1360px] items-center justify-between gap-2 sm:gap-4 rounded-full px-3.5 sm:px-8 shadow-xl">
      <Link href="/dashboard" aria-label="Elevate — all businesses" className="flex items-center shrink-0">
        <Logo width={92} priority className="sm:w-[112px]" />
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <Suspense fallback={<div aria-hidden="true" className="size-9 sm:size-10 rounded-full bg-active/50" />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}
