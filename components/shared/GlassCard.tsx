"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
