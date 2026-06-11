"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/types";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  message: string;
}

export function AvailabilityIndicator({
  status,
  message,
}: AvailabilityIndicatorProps) {
  if (status === "idle") return null;

  const config = {
    checking: {
      icon: Loader2,
      className: "text-orange-200",
      iconClassName: "animate-spin",
    },
    available: {
      icon: CheckCircle2,
      className: "text-emerald-300",
      iconClassName: "",
    },
    taken: {
      icon: XCircle,
      className: "text-red-300",
      iconClassName: "",
    },
    error: {
      icon: AlertCircle,
      className: "text-amber-300",
      iconClassName: "",
    },
  } as const;

  const current = config[status as keyof typeof config];
  if (!current) return null;

  const Icon = current.icon;
  const prefix = status === "taken" ? "❌ " : status === "available" ? "✅ " : "";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status + message}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn("mt-1.5 flex items-center gap-1.5 text-xs", current.className)}
        role="status"
        aria-live="polite"
      >
        <Icon className={cn("size-3.5 shrink-0", current.iconClassName)} />
        <span>
          {prefix}
          {message}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
