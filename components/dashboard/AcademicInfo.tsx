"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types";

interface AcademicInfoProps {
  student: Student;
}

const infoItems = [
  {
    key: "yearLevel",
    label: "Year Level",
    icon: BookOpen,
    format: (s: Student) => `Year ${s.yearLevel}`,
  },
  {
    key: "section",
    label: "Section",
    icon: Users,
    format: (s: Student) => `Section ${s.section}`,
  },
  {
    key: "classGroup",
    label: "Class Group",
    icon: Users,
    format: (s: Student) => `Group ${s.classGroupLabel}`,
  },
  {
    key: "academicYear",
    label: "Academic Year",
    icon: Calendar,
    format: (s: Student) => s.academicYear,
  },
  {
    key: "cohortYear",
    label: "Cohort Year",
    icon: Calendar,
    format: (s: Student) => s.cohortYear,
  },
] as const;

export function AcademicInfo({ student }: AcademicInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-indigo-500" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Icon className="size-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.format(student)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">IT Department</Badge>
            <Badge variant="outline" className="capitalize">
              {student.type}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
