"use client";

import Link from "next/link";
import { ChevronDownIcon, ShieldIcon, SwitchIcon } from "@/components/icons";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { Dropdown } from "./dropdown";

export type WorkspaceUser = { name: string; email: string | null };

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

const item =
  "flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-muted transition-colors hover:bg-active/70 hover:text-foreground";

export function UserMenu({ user, businessId }: { user: WorkspaceUser; businessId?: string }) {
  return (
    <Dropdown
      align="right"
      label="Account menu"
      triggerClassName="inline-flex h-8 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-surface pl-1 pr-2 sm:pr-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-active/60"
      trigger={
        <>
          <span className="inline-flex size-6 sm:size-8 items-center justify-center rounded-full bg-primary text-[10px] sm:text-xs font-bold text-primary-foreground">
            {initials(user.name)}
          </span>
          <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
          <ChevronDownIcon size={12} className="sm:size-3.5" />
        </>
      }
    >
      {(close) => (
        <div className="flex flex-col gap-0.5">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            {user.email ? <p className="truncate text-xs text-muted">{user.email}</p> : null}
          </div>
          {businessId ? (
            <Link href={`/dashboard/${businessId}/security`} onClick={close} className={item}>
              <ShieldIcon />
              Account Security (2FA)
            </Link>
          ) : null}
          <Link href="/dashboard" onClick={close} className={item}>
            <SwitchIcon />
            Switch Workspace
          </Link>
          <div className="mt-1 border-t border-border pt-1">
            <SignOutButton variant="row" />
          </div>
        </div>
      )}
    </Dropdown>
  );
}
