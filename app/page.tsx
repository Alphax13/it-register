"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { RegisterForm } from "@/components/register/RegisterForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      <AnimatedBackground />

      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-lg shadow-orange-500/30">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold tracking-wide text-white sm:text-sm">ITPSRU</span>
          <span className="hidden text-sm text-zinc-400 sm:inline">· Register</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-3 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-10 lg:pt-12">
        <div className="w-full max-w-3xl space-y-6 sm:space-y-8">

          {/* Intro Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <p className="text-xs font-semibold tracking-wider text-orange-300/90 uppercase">
                Introduction
              </p>
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex justify-center sm:mb-6"
            >
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-400 backdrop-blur-sm sm:px-3.5 sm:text-xs">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                <span className="truncate">สาขาเทคโนโลยีสารสนเทศ · ITPSRU</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                สมัครสมาชิก<span className="text-orange-400">นักศึกษา</span>
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400 sm:mt-3 sm:text-base">
                กรอกข้อมูลเพื่อสมัครเข้าใช้งานระบบสารสนเทศ ITPSRU
              </p>
            </motion.div>
          </section>

          {/* Form Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="mb-5 border-b border-white/10 pb-4">
              <p className="text-xs font-semibold tracking-wider text-orange-300/90 uppercase">
                Registration Form
              </p>
              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                ข้อมูลสำหรับสมัครสมาชิก
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <RegisterForm />
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
