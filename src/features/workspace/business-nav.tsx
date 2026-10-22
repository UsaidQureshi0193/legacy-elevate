"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons";
import { Dropdown } from "./dropdown";
import { getNav, isActive } from "./nav-groups";

const linkBase =
  "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors";
const idle = "text-muted hover:bg-active/70 hover:text-foreground";
const current = "bg-active font-semibold text-foreground";

function ActiveDot() {
  return <span aria-hidden="true" className="size-2 rounded-full bg-primary ring-1 ring-black/15 dark:ring-0" />;
}

/** Desktop centre nav (≥1024px): Overview plus three hover dropdown groups. */
export function BusinessNav() {
  const pathname = usePathname();
  const { businessId } = useParams<{ businessId: string }>();
  const { overview, groups } = getNav(`/dashboard/${businessId}`);

  return (
    <nav aria-label="Business sections" className="flex items-center gap-1">
      <Link
        href={overview.href}
        prefetch={true}
        aria-current={isActive(pathname, overview) ? "page" : undefined}
        className={`${linkBase} ${isActive(pathname, overview) ? current : idle}`}
      >
        {overview.label}
      </Link>
      {groups.map((group) => {
        const groupActive = group.items.some((i) => isActive(pathname, i));
        return (
          <Dropdown
            key={group.label}
            label={`${group.label} menu`}
            triggerClassName={`${linkBase} ${groupActive ? current : idle}`}
            trigger={
              <>
                {group.label}
                <ChevronDownIcon size={14} />
              </>
            }
          >
            {(close) => (
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={true}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm whitespace-nowrap ${
                          active ? current : idle
                        }`}
                      >
                        <item.Icon />
                        <span>{item.label}</span>
                        {active ? <span className="ml-auto"><ActiveDot /></span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Dropdown>
        );
      })}
    </nav>
  );
}

/** Flat grouped list for the hamburger menu (<1024px). */
export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const { businessId } = useParams<{ businessId: string }>();
  const { overview, groups } = getNav(`/dashboard/${businessId}`);
  const all = [{ label: "", items: [overview] }, ...groups];

  return (
    <nav aria-label="Business sections" className="flex flex-col gap-4">
      {all.map((group) => (
        <div key={group.label || "main"} className="flex flex-col gap-0.5">
          {group.label ? <p className="px-3 pb-1 text-xs font-medium text-muted">{group.label}</p> : null}
          {group.items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex h-11 items-center gap-2.5 rounded-xl px-3 text-sm ${active ? current : idle}`}
              >
                <item.Icon />
                <span>{item.label}</span>
                {active ? <span className="ml-auto"><ActiveDot /></span> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
