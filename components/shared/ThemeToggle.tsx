"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "glass" | "default";
}

function subscribe() {
  return () => {};
}

export function ThemeToggle({ variant = "glass" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const buttonClassName =
    variant === "glass"
      ? "text-white hover:bg-white/10"
      : "text-foreground hover:bg-muted";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(buttonClassName)}
        disabled
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(buttonClassName)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
