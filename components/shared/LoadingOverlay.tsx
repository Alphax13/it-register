"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  message = "Creating Account...",
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md dark:bg-black/40"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner className="size-10 text-white" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg font-medium text-white"
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
