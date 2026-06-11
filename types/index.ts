export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  nationalId: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  yearLevel: number;
  section: string;
  classGroupLabel: string;
  academicYear: string;
  cohortYear: string;
  type: string;
  avatarUrl?: string;
}

export interface RegisterPayload {
  studentCode: string;
  fullName: string;
  nickname: string;
  email: string;
  password: string;
  yearLevel: number;
  classGroupLabel: string;
  type: string;
  section: string;
  cohortYear: string;
  academicYear: string;
  phoneNumber: string;
  birthDate: string;
  nationalId: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  previousSchool: string;
  studyPlan: string;
  educationalQualification: "ม.6" | "ปวช." | "ปวส.";
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    studentCode: string;
    fullName: string;
    email: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    student: Student;
  };
}

export interface StudentSearchResponse {
  success: boolean;
  students: Student[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface AuthUser {
  studentCode: string;
  fullName: string;
  email: string;
  exp: number;
  iat: number;
  sub?: string;
}

export type PasswordStrength = "weak" | "medium" | "strong" | "empty";

export type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

export interface RegisterFormData {
  studentCode: string;
  fullName: string;
  nickname?: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  birthDate: string;
  nationalId: string;
  address: string;
  previousSchool: string;
  qualification: "ม.6" | "ปวช." | "ปวส.";
  studyPlan: string;
  guardianName: string;
  guardianPhone: string;
  curriculum: "REGULAR" | "TRANSFER";
  cohortYear?: string;
  yearLevel?: string;
  section?: string;
  classGroup?: string;
  academicYear?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterSuccessData {
  studentCode: string;
  fullName: string;
  email: string;
}
