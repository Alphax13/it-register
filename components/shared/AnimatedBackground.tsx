"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top center orange radial glow */}
      <div className="absolute -top-60 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[120px]" />

      {/* Bottom right amber glow */}
      <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-amber-500/10 blur-[100px]" />

      {/* Animated left blob */}
      <motion.div
        className="absolute -left-40 top-1/3 h-100 w-100 rounded-full bg-orange-600/10 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated right blob */}
      <motion.div
        className="absolute -right-32 top-1/2 h-87.5 w-87.5 rounded-full bg-amber-400/8 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
