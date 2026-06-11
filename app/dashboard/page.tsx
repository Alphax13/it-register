"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { AcademicInfo } from "@/components/dashboard/AcademicInfo";
import { EditProfileDialog } from "@/components/dashboard/EditProfileDialog";
import { getCurrentStudent } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Student } from "@/types";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function fetchStudent() {
      try {
        const data = await getCurrentStudent();
        setStudent(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load profile";
        setError(message);

        if (user) {
          setStudent({
            id: user.sub ?? "",
            studentCode: user.studentCode,
            fullName: user.fullName,
            nickname: user.fullName.split(" ")[0] ?? "",
            email: user.email,
            phoneNumber: "",
            birthDate: "",
            nationalId: "",
            address: "",
            guardianName: "",
            guardianPhone: "",
            yearLevel: 1,
            section: "A",
            classGroupLabel: "1",
            academicYear: "2568",
            cohortYear: "2568",
            type: "student",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    void fetchStudent();
  }, [authLoading, user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-indigo-500" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground">
            {error ?? "Unable to load your profile"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <DashboardHeader />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Student Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile and academic information
            </p>
          </div>
          <EditProfileDialog student={student} onUpdate={setStudent} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ProfileCard student={student} />
          </div>
          <div className="lg:col-span-3">
            <AcademicInfo student={student} />
          </div>
        </div>
      </main>
    </div>
  );
}
