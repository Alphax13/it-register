"use client";

import { motion } from "framer-motion";
import { getPasswordStrength } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthConfig = {
  empty: { label: "", color: "bg-muted", textColor: "text-muted-foreground" },
  weak: { label: "Weak", color: "bg-red-500", textColor: "text-red-400" },
  medium: { label: "Medium", color: "bg-amber-500", textColor: "text-amber-400" },
  strong: { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400" },
} as const;

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label } = getPasswordStrength(password);
  const config = strengthConfig[label];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", config.color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-orange-200/80">ความแข็งแกร่งของรหัสผ่าน</span>
        <motion.span
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("text-xs font-medium", config.textColor)}
        >
          {config.label}
        </motion.span>
      </div>
    </div>
  );
}
