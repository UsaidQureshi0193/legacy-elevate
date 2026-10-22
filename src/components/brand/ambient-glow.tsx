/**
 * Animated Ambient Aurora Glow
 * Soft, moving multi-tier mesh gradient orbs with GPU-accelerated keyframe drift.
 * Positioned in fixed background behind all interactive elements.
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Top Center Ambient Aurora Orb */}
      <div className="animate-aurora-1 absolute -top-48 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-primary/10 blur-[150px] dark:bg-primary/[0.08]" />
      
      {/* Mid Left Ambient Aurora Orb */}
      <div className="animate-aurora-2 absolute top-1/3 -left-52 size-[550px] rounded-full bg-primary/[0.06] blur-[130px] dark:bg-primary/[0.05]" />
      
      {/* Bottom Right Ambient Aurora Orb */}
      <div className="animate-aurora-3 absolute -bottom-32 -right-52 size-[650px] rounded-full bg-primary/[0.07] blur-[140px] dark:bg-primary/[0.06]" />
    </div>
  );
}
