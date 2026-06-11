import { decodeJwt } from "jose";
import type { AuthUser } from "@/types";

const TOKEN_KEY = "it_register_auth_token";
const REMEMBER_KEY = "it_register_remember_me";
const AUTH_COOKIE = "auth_token";

const isBrowser = typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, rememberMe = true): void {
  if (!isBrowser) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REMEMBER_KEY, String(rememberMe));

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeToken(): void {
  if (!isBrowser) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getRememberMe(): boolean {
  if (!isBrowser) return true;
  return localStorage.getItem(REMEMBER_KEY) !== "false";
}

export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = decodeJwt(token);
    return {
      studentCode: (payload.studentCode as string) ?? (payload.sub as string) ?? "",
      fullName: (payload.fullName as string) ?? (payload.name as string) ?? "",
      email: (payload.email as string) ?? "",
      exp: (payload.exp as number) ?? 0,
      iat: (payload.iat as number) ?? 0,
      sub: payload.sub,
    };
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const user = decodeToken(token);
  if (!user || !user.exp) return false;
  return user.exp * 1000 > Date.now();
}

export function getAuthUser(): AuthUser | null {
  const token = getToken();
  if (!isTokenValid(token)) return null;
  return decodeToken(token!);
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE;
}
