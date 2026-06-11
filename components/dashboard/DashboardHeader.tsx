"use client";

import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <GraduationCap className="size-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">IT Department</p>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user.fullName}
            </span>
          )}
          <ThemeToggle variant="default" />
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
