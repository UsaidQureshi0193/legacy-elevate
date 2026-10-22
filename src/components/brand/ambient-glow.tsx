/**
 * Animated Ambient Aurora Mesh
 * High-end multi-chromatic aurora glow combining subtle emerald, cyan, and violet hints.
 * Calibrated specifically for both Light (crisp, ethereal studio light without yellow haze)
 * and Dark (deep futuristic fintech terminal depth).
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Orb 1: Top Center — Fresh Mint in Light / Electric Lime in Dark */}
      <div className="animate-aurora-1 absolute -top-48 left-1/2 -translate-x-1/2 size-[750px] rounded-full blur-[140px] opacity-90 transition-opacity bg-[radial-gradient(circle,rgba(16,185,129,0.035)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.075)_0%,transparent_70%)]" />

      {/* Orb 2: Top Left — Celestial Azure in Light / Cyber Cyan in Dark */}
      <div className="animate-aurora-2 absolute top-1/4 -left-48 size-[550px] rounded-full blur-[130px] opacity-80 transition-opacity bg-[radial-gradient(circle,rgba(56,189,248,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)]" />

      {/* Orb 3: Mid/Bottom Right — Whispering Lilac in Light / Deep Violet in Dark */}
      <div className="animate-aurora-3 absolute top-1/2 -right-48 size-[600px] rounded-full blur-[150px] opacity-75 transition-opacity bg-[radial-gradient(circle,rgba(168,85,247,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.045)_0%,transparent_70%)]" />

      {/* Fine tactile micro-grain noise overlay — removes digital banding and delivers luxury frosted-glass finish */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}
