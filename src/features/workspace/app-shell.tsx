"use client";

import { Suspense, useState, type ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BusinessNav, MobileNav } from "./business-nav";
import { RouteProgress } from "./route-progress";

const navFallback = <div aria-hidden="true" className="h-10 w-80 rounded-full bg-active/50" />;

/**
 * Shell for one business workspace: a fixed floating pill navbar (logo,
 * business switcher, grouped dropdown nav, theme, user menu). Below 1024px
 * the centre nav folds into a hamburger with a full-screen menu.
 * `scope` is the business switcher, `account` the user menu (both slots are
 * server-rendered behind Suspense in layout.tsx).
 */
export function AppShell({
  scope,
  account,
  children,
}: {
  scope: ReactNode;
  account: ReactNode;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      {/* Subtle ambient decorative glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-primary/[0.08] blur-[140px]" />
        <div className="absolute top-1/2 -right-48 size-[500px] rounded-full bg-primary/[0.05] blur-[120px]" />
        <div className="absolute -bottom-32 -left-48 size-[500px] rounded-full bg-primary/[0.04] blur-[130px]" />
      </div>

      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>

      <header className="floating-nav fixed inset-x-4 top-4 z-50 mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 rounded-full px-4 py-2 shadow-lg sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" aria-label="Elevate — all businesses" className="flex items-center shrink-0 translate-y-[1.5px]">
            <Logo width={100} priority />
          </Link>
          <div className="min-w-0">{scope}</div>
        </div>

        <div className="hidden lg:block">
          <Suspense fallback={navFallback}>
            <BusinessNav />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">{account}</div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="workspace-menu"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            <MenuIcon size={18} />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </header>

      <div
        id="workspace-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
        data-open={menuOpen}
        className="fixed inset-0 z-[60] flex-col gap-5 overflow-y-auto bg-background px-4 py-3 data-[open=true]:flex lg:hidden"
      >
        <div className="flex h-10 items-center justify-between">
          <Logo width={100} />
          <button
            type="button"
            onClick={close}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border"
          >
            <CloseIcon size={18} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <Suspense fallback={navFallback}>
          <MobileNav onNavigate={close} />
        </Suspense>
        <div className="mt-auto border-t border-border pt-3 sm:hidden">{account}</div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

/** Business switcher badge in the navbar; links to the business list. */
export function BusinessScope({ name, detail }: { name: string; detail: string }) {
  return (
    <Link
      href="/dashboard"
      title="Switch business"
      className="inline-flex h-10 max-w-44 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-foreground hover:bg-active/60 sm:max-w-64"
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary ring-1 ring-black/15 dark:ring-0" />
      <span className="truncate font-semibold">{name}</span>
      {detail ? <span className="hidden truncate text-xs text-muted xl:inline">({detail})</span> : null}
      <span className="sr-only">Switch business</span>
    </Link>
  );
}
