"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { container: "h-16 w-16", icon: "h-8 w-8" },
  md: { container: "h-24 w-24", icon: "h-12 w-12" },
  lg: { container: "h-28 w-28", icon: "h-14 w-14" },
};

export function FloatingLogo({ size = "md", className }: FloatingLogoProps) {
  const sizeConfig = sizes[size];

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className={cn("flex justify-center", className)}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-white/20 shadow-xl backdrop-blur-sm",
          sizeConfig.container
        )}
      >
        <GraduationCap className={cn("text-white", sizeConfig.icon)} />
      </div>
    </motion.div>
  );
}
