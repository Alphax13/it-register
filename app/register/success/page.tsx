"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { GlassCard } from "@/components/shared/GlassCard";
import { FloatingLogo } from "@/components/shared/FloatingLogo";
import { ConfettiEffect } from "@/components/register/ConfettiEffect";
import { Button } from "@/components/ui/button";
import type { RegisterSuccessData } from "@/types";

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [data, setData] = useState<RegisterSuccessData | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = sessionStorage.getItem("register_success");
      if (!stored) {
        router.replace("/");
        return;
      }

      try {
        setData(JSON.parse(stored) as RegisterSuccessData);
        sessionStorage.removeItem("register_success");
      } catch {
        router.replace("/");
      }
    });
  }, [router]);

  if (!data) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
        <AnimatedBackground />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-6">
      <AnimatedBackground />
      <ConfettiEffect />

      <GlassCard className="relative z-10 w-full max-w-md text-center">
        <FloatingLogo size="md" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="mx-auto mt-6 flex size-16 items-center justify-center rounded-full bg-emerald-500/20"
        >
          <CheckCircle2 className="size-10 text-emerald-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-3xl font-black text-white"
        >
          ลงทะเบียนสำเร็จ!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-orange-100"
        >
          บัญชีนักศึกษาของคุณถูกสร้างเรียบร้อยแล้ว
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
        >
          <div>
            <p className="text-xs text-orange-200/70">รหัสนักศึกษา</p>
            <p className="font-semibold text-white">{data.studentCode}</p>
          </div>
          <div>
            <p className="text-xs text-orange-200/70">ชื่อ-นามสกุล</p>
            <p className="font-semibold text-white">{data.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-orange-200/70">อีเมล</p>
            <p className="font-semibold text-white">{data.email}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Button
            asChild
            className="h-12 w-full rounded-2xl bg-orange-500 text-base font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              เข้าสู่ระบบ
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </GlassCard>
    </main>
  );
}
