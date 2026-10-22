import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AssistantIcon, CheckIcon, InvoiceScanIcon, ShieldIcon } from "@/components/icons";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * Modern split-screen layout shared by sign-in, sign-up and password reset.
 * Desktop: Left brand showcase with value props & trust metrics; Right form card.
 * Mobile: Cohesive centered card with high visual quality.
 */
export function AuthShell({ title, description, children }: AuthShellProps) {
  const highlights = [
    {
      icon: InvoiceScanIcon,
      title: "Smart Vision Invoice OCR",
      desc: "Snap wholesale paper bills — stock auto-updates with zero math errors.",
    },
    {
      icon: ShieldIcon,
      title: "100% Free 2FA Protection",
      desc: "Bank-grade Google Authenticator TOTP security with multi-tenant data isolation.",
    },
    {
      icon: AssistantIcon,
      title: "Bilingual Retail Co-Pilot",
      desc: "Instant answers in English, Urdu, or Roman Urdu grounded in your store's sales.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Mobile Top Header (<1024px) */}
      <header className="flex h-16 w-full items-center justify-between border-b border-border px-5 lg:hidden">
        <Link href="/" aria-label="Elevate home">
          <Logo width={110} priority />
        </Link>
        <ThemeToggle />
      </header>

      <div className="grid flex-1 lg:grid-cols-12">
        {/* Left Column: Premium Brand Showcase (Desktop ≥1024px) */}
        <aside className="relative hidden lg:col-span-7 lg:flex flex-col justify-between border-r border-border bg-surface-muted/40 p-12 xl:p-16 overflow-hidden">
          {/* Subtle decorative glow */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-primary/5 blur-3xl" />

          {/* Top Brand Link */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" aria-label="Elevate home">
              <Logo width={120} priority />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted shadow-2xs">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span>Built for Pakistan Retailers</span>
            </div>
          </div>

          {/* Center Pitch & Highlights */}
          <div className="relative z-10 my-auto max-w-xl flex flex-col gap-8 py-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground leading-tight">
                Run your shop on verified numbers, not guesswork.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Elevate replaces loose registers and unverified supplier bills with paisa-exact inventory, profit calculations, and an accessible AI assistant.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-surface/80 p-4 shadow-xs backdrop-blur-xs transition hover:border-border hover:bg-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted border border-border text-primary shadow-2xs">
                      <Icon size={18} />
                    </span>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-foreground">{h.title}</h3>
                      <p className="text-xs text-muted leading-relaxed mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonial Quote */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
              <p className="italic text-foreground leading-relaxed">
                &ldquo;Elevate helped us catch Rs 24,000 in supplier overcharges in our very first month. We finally know our exact profit at the end of each day.&rdquo;
              </p>
              <div className="mt-2.5 flex items-center gap-2 text-muted font-medium text-[11px]">
                <CheckIcon size={13} className="text-primary" />
                <span>Verified Grocery &amp; General Store Owner · Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <footer className="relative z-10 flex items-center justify-between text-xs text-muted pt-6 border-t border-border/80">
            <span>© 2026 Elevate. All rights reserved.</span>
            <span>AES-256 Multi-Tenant Isolation</span>
          </footer>
        </aside>

        {/* Right Column: Form Container */}
        <main className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:p-12 xl:p-16">
          <div className="hidden lg:flex justify-end">
            <ThemeToggle />
          </div>

          <section className="mx-auto w-full max-w-[420px] my-auto py-6">
            <div className="mb-6 flex flex-col gap-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
              <p className="text-sm text-muted leading-relaxed">{description}</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
              {children}
            </div>

            <p className="mt-5 text-center text-xs text-muted flex items-center justify-center gap-1.5">
              <ShieldIcon size={13} className="text-primary" />
              <span>Your business records are private and encrypted.</span>
            </p>
          </section>

          <div className="text-center text-xs text-muted/60 lg:hidden py-4">
            © 2026 Elevate · Pakistan
          </div>
        </main>
      </div>
    </div>
  );
}
