"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { CheckIcon, ShieldIcon } from "@/components/icons";
import { QrCode } from "@/features/security/qr-code";
import { getClientAuth } from "@/lib/firebase/client";
import { readableAuthError } from "./auth-errors";
import { createServerSession } from "./session-client";
import {
  errorTextClass,
  fieldClass,
  inputClass,
  labelClass,
  mutedLinkClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./ui";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Step 2: 2FA Setup state if user opted into 2FA during sign up
  const [mfaSetup, setMfaSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        getClientAuth(),
        email.trim(),
        password,
      );
      if (name.trim() !== "") {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      // Force a fresh token so it carries the display name we just set.
      const idToken = await credential.user.getIdToken(true);
      await createServerSession(idToken);

      // If user chose to enable 2FA during sign-up, start setup immediately
      if (enable2FA) {
        const setupRes = await fetch("/api/auth/2fa/setup", { method: "POST" });
        const setupData = (await setupRes.json().catch(() => null)) as {
          secret?: string;
          uri?: string;
          error?: string;
        } | null;

        if (!setupRes.ok || !setupData?.secret || !setupData?.uri) {
          throw new Error(
            setupData?.error ??
              "Could not start 2FA setup. Your account was created, and you can enable 2FA anytime in settings.",
          );
        }

        setMfaSetup({ secret: setupData.secret, uri: setupData.uri });
        setPending(false);
        return;
      }

      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && !("code" in err) ? err.message : readableAuthError(err));
      setPending(false);
    }
  }

  async function onVerify2FA(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode.trim() }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Invalid code. Please check your authenticator app and try again.");
      }
      setVerifiedSuccess(true);
      setTimeout(() => {
        router.replace("/onboarding");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setPending(false);
    }
  }

  function skip2FA() {
    router.replace("/onboarding");
    router.refresh();
  }

  // --- Render Step 2: 2FA Setup Flow ---
  if (mfaSetup) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <ShieldIcon size={14} />
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-primary">
              Step 2 of 2 · Account Security
            </span>
          </div>
          <span className="rounded-full border border-rule bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-muted">
            100% Free
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-foreground">
            Connect Your Authenticator App
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Open Google Authenticator, Microsoft Authenticator, or 1Password and scan this QR code.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center rounded-2xl border border-border bg-white p-4 shadow-xs">
          <QrCode value={mfaSetup.uri} label="Scan QR code with Authenticator app" />
        </div>

        {/* Manual Setup Key with 1-click copy */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-muted/60 p-2.5 text-xs">
          <span className="text-muted shrink-0">Setup key:</span>
          <code className="font-mono font-bold text-foreground select-all truncate">
            {mfaSetup.secret}
          </code>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(mfaSetup.secret);
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-surface-muted shrink-0 transition"
          >
            {copiedKey ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* 6-digit Code Verification Form */}
        <form onSubmit={onVerify2FA} className="flex flex-col gap-3">
          <div className={fieldClass}>
            <label htmlFor="mfa-verify-code" className={labelClass}>
              Enter 6-digit code from authenticator
            </label>
            <input
              id="mfa-verify-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className={`${inputClass} text-center font-mono text-base tracking-widest`}
              autoFocus
            />
          </div>

          {error ? (
            <p role="alert" className={errorTextClass}>
              {error}
            </p>
          ) : null}

          {verifiedSuccess ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs font-semibold text-primary">
              <CheckIcon size={16} className="text-primary" />
              <span>Two-factor authentication verified! Entering workspace…</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending || totpCode.length !== 6 || verifiedSuccess}
            className={primaryButtonClass}
          >
            {pending ? "Verifying code…" : "Verify and Complete Sign-up"}
          </button>

          <button
            type="button"
            disabled={pending || verifiedSuccess}
            onClick={skip2FA}
            className={`${secondaryButtonClass} w-full text-xs text-muted hover:text-foreground`}
          >
            Skip for now (you can enable it later in settings)
          </button>
        </form>
      </div>
    );
  }

  // --- Render Step 1: Standard Sign-up Form with 2FA Option Checkbox ---
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className={fieldClass}>
        <label htmlFor="sign-up-name" className={labelClass}>
          Your name
        </label>
        <input
          id="sign-up-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          placeholder="Ayesha Khan"
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor="sign-up-email" className={labelClass}>
          Email
        </label>
        <input
          id="sign-up-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor="sign-up-password" className={labelClass}>
          Password
        </label>
        <input
          id="sign-up-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-muted">At least 6 characters.</p>
      </div>

      {/* 2FA Option Card during Sign Up (Optional - User's Choice) */}
      <div className="rounded-xl border border-border bg-surface-muted/50 p-3.5 transition-colors hover:bg-surface-muted/80">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id="sign-up-enable-2fa"
            type="checkbox"
            checked={enable2FA}
            onChange={(event) => setEnable2FA(event.target.checked)}
            className="mt-1 size-4 rounded border-control text-primary focus:ring-primary accent-[var(--primary)] cursor-pointer"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ShieldIcon size={14} className="text-primary" />
              Enable Two-Factor Authentication (2FA)
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Recommended
              </span>
            </span>
            <span className="text-xs text-muted leading-relaxed">
              Add extra bank-grade protection with Google Authenticator or Microsoft Authenticator. You can also turn this on or off later anytime from account settings.
            </span>
          </div>
        </label>
      </div>

      {error ? (
        <p role="alert" className={errorTextClass}>
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Creating account…" : enable2FA ? "Continue to 2FA Setup →" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className={mutedLinkClass}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
