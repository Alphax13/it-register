import { z } from "zod";

const phoneRegex = /^0\d{1,2}-?\d{3}-?\d{4}$/;
const studentCodeRegex = /^[0-9]{10,11}$/;
const nationalIdRegex = /^[0-9]{13}$/;

export const registerSchema = z
  .object({
    studentCode: z
      .string()
      .min(1, "Student code is required")
      .regex(studentCodeRegex, "Student code must be 10-11 digits"),
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    nickname: z
      .string()
      .max(50, "Nickname must be less than 50 characters")
      .optional()
      .default(""),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Phone number format is invalid"),
    birthDate: z
      .string()
      .min(1, "Birth date is required")
      .refine((date) => {
        const parsed = new Date(date);
        const now = new Date();
        const minAge = new Date(
          now.getFullYear() - 100,
          now.getMonth(),
          now.getDate()
        );
        const maxAge = new Date(
          now.getFullYear() - 15,
          now.getMonth(),
          now.getDate()
        );
        return parsed >= minAge && parsed <= maxAge;
      }, "Please enter a valid birth date"),
    nationalId: z
      .string()
      .min(1, "National ID is required")
      .regex(nationalIdRegex, "National ID must be exactly 13 digits"),
    address: z
      .string()
      .min(1, "กรุณากรอกที่อยู่")
      .min(5, "ที่อยู่ต้องมีอย่างน้อย 5 ตัวอักษร")
      .max(500, "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร"),
    previousSchool: z.string().min(1, "กรุณากรอกสถานศึกษาเดิม"),
    qualification: z.enum(["ม.6", "ปวช.", "ปวส."] as const, {
      message: "กรุณาเลือกคุณวุฒิ",
    }),
    studyPlan: z.string().min(1, "กรุณากรอกแผนการเรียน"),
    curriculum: z.enum(["REGULAR", "TRANSFER"] as const, {
      message: "กรุณาเลือกหลักสูตร",
    }),
    guardianName: z
      .string()
      .min(1, "Guardian name is required")
      .min(2, "Guardian name must be at least 2 characters"),
    guardianPhone: z
      .string()
      .min(1, "Guardian phone is required")
      .regex(phoneRegex, "Guardian phone format is invalid"),
    yearLevel: z.string().optional().default("1"),
    section: z.string().optional().default("IT"),
    classGroup: z.string().optional().default(""),
    academicYear: z.string().optional().default(""),
    cohortYear: z.string().optional().default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const previousSchoolSchema = z.string().min(1, "กรุณากรอกสถานศึกษาเดิม");

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export function getPasswordStrength(password: string): {
  score: number;
  label: "weak" | "medium" | "strong" | "empty";
} {
  if (!password) {
    return { score: 0, label: "empty" };
  }

  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (password.length >= 16) score += 10;

  if (score < 40) return { score, label: "weak" };
  if (score < 70) return { score, label: "medium" };
  return { score, label: "strong" };
}
