"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckIcon, ShieldIcon } from "@/components/icons";
import {
  errorTextClass,
  fieldClass,
  inputClass,
  labelClass,
  panelPadClass,
  panelTitleClass,
  primaryActionClass,
  secondaryButtonClass,
  successTextClass,
} from "@/features/auth/ui";
import { QrCode } from "./qr-code";

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => null)) as Record<string, string> | null;
  if (!res.ok) throw new Error(data?.error ?? "Something went wrong. Please try again.");
  return data ?? {};
}

export function TotpSettings() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [disabling, setDisabling] = useState(false);
  const [code, setCode] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/auth/2fa/setup")
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => setEnabled(d.enabled === true))
      .catch(() => setError("Could not load 2FA status."));
  }, []);

  async function run(fn: () => Promise<void>) {
    setError(null);
    setMessage(null);
    setPending(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setPending(false);
  }

  const start = () =>
    run(async () => {
      const d = await post("/api/auth/2fa/setup");
      setSetup({ secret: d.secret, uri: d.uri });
      setCode("");
    });

  const confirm = (e: FormEvent) => {
    e.preventDefault();
    return run(async () => {
      await post("/api/auth/2fa/verify-setup", { code });
      setSetup(null);
      setCode("");
      setEnabled(true);
      setMessage("Two-factor authentication is now active. You will be asked for a code whenever you sign in.");
    });
  };

  const disable = (e: FormEvent) => {
    e.preventDefault();
    return run(async () => {
      await post("/api/auth/2fa/disable", { code });
      setDisabling(false);
      setCode("");
      setEnabled(false);
      setMessage("Two-factor authentication has been turned off.");
    });
  };

  if (enabled === null && !error) {
    return <p className="text-sm text-muted">Checking account security status…</p>;
  }

  const codeField = (id: string, label: string) => (
    <div className={fieldClass}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={6}
        required
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className={`${inputClass} font-mono tracking-widest text-center`}
        placeholder="123456"
        autoFocus
      />
    </div>
  );

  return (
    <section className={`${panelPadClass} flex max-w-xl flex-col gap-5`} aria-labelledby="totp-heading">
      <div className="flex items-center justify-between gap-3 border-b border-rule pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <ShieldIcon size={16} />
          </span>
          <div>
            <h2 id="totp-heading" className={panelTitleClass}>
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-xs text-muted">Standard RFC 6238 TOTP authenticator protection</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            enabled
              ? "border border-primary/30 bg-primary/10 text-primary"
              : "border border-border bg-surface-muted text-muted"
          }`}
        >
          {enabled ? (
            <>
              <CheckIcon size={12} className="text-primary" /> Active
            </>
          ) : (
            "Disabled"
          )}
        </span>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        {enabled
          ? "Your account is secured with two-factor authentication. In addition to your password, you will be required to provide a 6-digit code from Google Authenticator, Microsoft Authenticator, or 1Password when signing in."
          : "Add an extra layer of bank-grade security to your business data. Even if someone obtains your password, they cannot access your records without your authenticator app code."}
      </p>

      {/* Setup Mode: QR Code and verification form */}
      {setup ? (
        <form onSubmit={confirm} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted/30 p-4">
          <ol className="list-decimal space-y-1 pl-5 text-xs text-muted leading-relaxed">
            <li>Open Google Authenticator, Microsoft Authenticator, or 1Password on your phone.</li>
            <li>Scan this QR code, or copy and enter the setup key manually.</li>
            <li>Type the 6-digit code shown in your app to activate.</li>
          </ol>

          <div className="flex justify-center rounded-xl border border-border bg-white p-3 shadow-2xs">
            <QrCode value={setup.uri} label="QR code for your authenticator app" />
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs">
            <span className="text-muted shrink-0">Setup key:</span>
            <code className="font-mono font-bold text-foreground select-all truncate">
              {setup.secret}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(setup.secret);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-surface shrink-0 transition"
            >
              {copiedKey ? "Copied!" : "Copy"}
            </button>
          </div>

          {codeField("enrol-code", "Enter 6-digit verification code")}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button type="submit" disabled={pending || code.length !== 6} className={primaryActionClass}>
              {pending ? "Verifying…" : "Turn on 2FA"}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={() => setSetup(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : disabling ? (
        /* Disabling Mode: Confirm with current code */
        <form onSubmit={disable} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted/30 p-4">
          <p className="text-xs text-muted">
            To turn off 2FA, enter the current 6-digit code from your authenticator app.
          </p>
          {codeField("disable-code", "Current 6-digit code")}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button type="submit" disabled={pending || code.length !== 6} className={primaryActionClass}>
              {pending ? "Disabling…" : "Confirm Disable 2FA"}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={() => setDisabling(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : enabled ? (
        /* Enabled state: Option to turn off */
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-muted">Want to turn off two-factor authentication?</span>
          <button
            type="button"
            onClick={() => {
              setDisabling(true);
              setCode("");
            }}
            className={secondaryButtonClass}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        /* Disabled state: Option to turn on */
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-muted">100% free · Works with any TOTP app</span>
          <button type="button" onClick={start} disabled={pending} className={primaryActionClass}>
            {pending ? "Loading…" : "Enable 2FA"}
          </button>
        </div>
      )}

      {error ? (
        <p role="alert" className={errorTextClass}>
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className={successTextClass}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
