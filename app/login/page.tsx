"use client";

import Link from "next/link";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { GlassCard } from "@/components/shared/GlassCard";
import { FloatingLogo } from "@/components/shared/FloatingLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-6">
      <AnimatedBackground />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <GlassCard className="relative z-10 w-full max-w-md">
        <FloatingLogo size="md" />

        <h1 className="mt-6 text-center text-3xl font-black text-white">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-blue-100">
          Sign in to your student account
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs text-blue-200/60">
          <Link href="/" className="hover:text-blue-100 hover:underline">
            Back to Home
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
