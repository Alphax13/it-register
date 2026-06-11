"use client";

import { useEffect, useState } from "react";
import { checkEmailExists, checkStudentCodeExists } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import type { AvailabilityStatus } from "@/types";

interface UseAvailabilityCheckOptions {
  value: string;
  type: "studentCode" | "email";
  enabled?: boolean;
  debounceMs?: number;
}

interface UseAvailabilityCheckResult {
  status: AvailabilityStatus;
  message: string;
}

export function useAvailabilityCheck({
  value,
  type,
  enabled = true,
  debounceMs = 500,
}: UseAvailabilityCheckOptions): UseAvailabilityCheckResult {
  const debouncedValue = useDebounce(value.trim(), debounceMs);
  const [checkResult, setCheckResult] = useState<{
    status: AvailabilityStatus;
    message: string;
  }>({ status: "idle", message: "" });

  const isCheckEnabled = enabled && debouncedValue.length > 0;

  useEffect(() => {
    if (!isCheckEnabled) return;

    let cancelled = false;

    async function check() {
      setCheckResult({
        status: "checking",
        message: "Checking availability...",
      });

      try {
        const exists =
          type === "studentCode"
            ? await checkStudentCodeExists(debouncedValue)
            : await checkEmailExists(debouncedValue);

        if (cancelled) return;

        if (exists) {
          setCheckResult({
            status: "taken",
            message:
              type === "studentCode"
                ? "Student Code already exists"
                : "Email already exists",
          });
        } else {
          setCheckResult({ status: "available", message: "Available" });
        }
      } catch {
        if (cancelled) return;
        setCheckResult({
          status: "error",
          message: "Unable to verify availability",
        });
      }
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [debouncedValue, type, isCheckEnabled]);

  if (!isCheckEnabled) {
    return { status: "idle" as const, message: "" };
  }

  return checkResult;
}
