/**
 * Modern High-End SaaS Ambient Background (Global across entire website)
 * Features:
 * - Large soft neon-lime green radial glow on upper-right (dashboard preview / action halo)
 * - Atmospheric neon-lime glow on upper-left
 * - Oversized abstract flowing ribbon gradient curves adding futuristic AI-business depth
 * - Lower-right and mid-section ambient radial lighting
 * - Fine tactile micro-grain noise overlay for anti-banding luxury finish
 * - Fixed position behind all content (pointer-events-none, -z-10, zero horizontal overflow)
 * - Automatically respects prefers-reduced-motion with motion-safe: prefixes
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Upper-Left Soft Ambient Glow */}
      <div className="motion-safe:animate-aurora-2 absolute -top-24 -left-36 size-[450px] sm:size-[620px] rounded-full blur-[120px] opacity-75 sm:opacity-85 bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.09)_0%,rgba(198,255,0,0.025)_45%,transparent_70%)]" />

      {/* 2. Upper-Right Prominent Neon-Lime Halo Glow */}
      <div className="motion-safe:animate-aurora-1 absolute top-4 -right-32 sm:right-[-5%] size-[500px] sm:size-[720px] rounded-full blur-[130px] opacity-85 sm:opacity-95 bg-[radial-gradient(circle,rgba(56,189,248,0.035)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.14)_0%,rgba(198,255,0,0.045)_45%,transparent_70%)]" />

      {/* 3. Oversized Abstract Flowing Ribbon Gradient Waves (Desktop & Tablet) */}
      <div className="motion-safe:animate-ribbon absolute top-4 left-1/2 -translate-x-1/2 w-[1400px] h-[950px] opacity-40 dark:opacity-75 hidden sm:block">
        <svg
          viewBox="0 0 1400 950"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="neonLimeRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.0" />
              <stop offset="25%" stopColor="#C6FF00" stopOpacity="0.14" />
              <stop offset="55%" stopColor="#C6FF00" stopOpacity="0.04" />
              <stop offset="80%" stopColor="#C6FF00" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#C6FF00" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="neonLimeRibbon2" x1="100%" y1="20%" x2="0%" y2="80%">
              <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.0" />
              <stop offset="30%" stopColor="#C6FF00" stopOpacity="0.10" />
              <stop offset="65%" stopColor="#C6FF00" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#C6FF00" stopOpacity="0.0" />
            </linearGradient>
            <filter id="ribbonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
          </defs>
          {/* Flowing ribbon wave 1 crossing down from top-right through center */}
          <path
            d="M 1320,40 C 1100,280 840,210 640,430 C 440,640 220,620 40,880"
            stroke="url(#neonLimeRibbon1)"
            strokeWidth="50"
            strokeLinecap="round"
            filter="url(#ribbonBlur)"
          />
          {/* Counter-curve flowing ribbon wave 2 */}
          <path
            d="M 80,140 C 340,90 620,320 860,290 C 1100,260 1260,540 1360,780"
            stroke="url(#neonLimeRibbon2)"
            strokeWidth="36"
            strokeLinecap="round"
            filter="url(#ribbonBlur)"
          />
        </svg>
      </div>

      {/* 4. Mid-Section Left Ambient Glow */}
      <div className="motion-safe:animate-aurora-3 absolute top-[38%] -left-44 size-[550px] rounded-full blur-[140px] opacity-65 bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.06)_0%,rgba(198,255,0,0.015)_50%,transparent_70%)]" />

      {/* 5. Lower-Right Ambient Aura */}
      <div className="motion-safe:animate-aurora-2 absolute top-[62%] -right-40 size-[620px] rounded-full blur-[140px] opacity-80 bg-[radial-gradient(circle,rgba(168,85,247,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.09)_0%,rgba(198,255,0,0.025)_45%,transparent_70%)]" />

      {/* 6. Bottom Ambient Depth Glow */}
      <div className="motion-safe:animate-aurora-1 absolute bottom-12 left-1/2 -translate-x-1/2 size-[680px] rounded-full blur-[150px] opacity-60 bg-[radial-gradient(circle,rgba(16,185,129,0.025)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(198,255,0,0.07)_0%,transparent_70%)]" />

      {/* 7. Fine tactile micro-grain noise overlay — removes digital banding and delivers luxury frosted-glass finish */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}
