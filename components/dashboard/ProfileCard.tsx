"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Student } from "@/types";

interface ProfileCardProps {
  student: Student;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileCard({ student }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <CardHeader className="-mt-12 flex flex-row items-end gap-4 pb-2">
          <Avatar className="size-20 border-4 border-card shadow-lg">
            <AvatarImage src={student.avatarUrl} alt={student.fullName} />
            <AvatarFallback className="bg-indigo-600 text-lg text-white">
              {getInitials(student.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-1">
            <CardTitle className="text-xl">{student.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              @{student.nickname}
            </p>
          </div>
          <Badge variant="secondary" className="mb-1">
            {student.studentCode}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 shrink-0" />
            <span>{student.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-2">{student.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-4 shrink-0" />
            <span>
              Guardian: {student.guardianName} ({student.guardianPhone})
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
