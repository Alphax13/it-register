import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  ApiError,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  Student,
  StudentSearchResponse,
} from "@/types";
import { getToken } from "@/lib/auth";

const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // browser: use relative URL → Next.js proxy (no CORS)
    : (process.env.EDUTRACK_API_URL ?? "https://itpsru-edutrack.vercel.app"); // server: direct call
const API_KEY =
  typeof window !== "undefined"
    ? "" // API key is kept server-side only
    : (process.env.EDUTRACK_API_KEY ?? "");

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (API_KEY) {
      config.headers.set("X-API-Key", API_KEY);
    }

    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const apiError: ApiError = {
        message:
          error.response?.data?.message ??
          error.message ??
          "An unexpected error occurred",
        status: error.response?.status,
      };
      return Promise.reject(apiError);
    }
  );

  return client;
}

const api = createApiClient();

export async function searchStudents(
  search: string
): Promise<StudentSearchResponse> {
  const response = await api.get<StudentSearchResponse>(
    "/api/external/students",
    { params: { search } }
  );
  return response.data;
}

export async function checkStudentCodeExists(
  studentCode: string
): Promise<boolean> {
  if (!studentCode.trim()) return false;
  const result = await searchStudents(studentCode);
  return (result.students ?? []).some(
    (student) =>
      student.studentCode.toLowerCase() === studentCode.toLowerCase()
  );
}

export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email.trim()) return false;
  const result = await searchStudents(email);
  return (result.students ?? []).some(
    (student) => student.email.toLowerCase() === email.toLowerCase()
  );
}

export async function registerStudent(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/api/external/register",
    payload
  );
  return response.data;
}

export async function loginStudent(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/api/external/login",
    payload
  );
  return response.data;
}

export async function getCurrentStudent(): Promise<Student> {
  const response = await api.get<{ data: Student }>(
    "/api/external/students/me"
  );
  return response.data.data;
}

export async function updateStudentProfile(
  payload: Partial<Student>
): Promise<Student> {
  const response = await api.patch<{ data: Student }>(
    "/api/external/students/me",
    payload
  );
  return response.data.data;
}

export { api };
