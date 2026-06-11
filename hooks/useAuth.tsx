"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginStudent } from "@/lib/api";
import {
  getAuthUser,
  getToken,
  isTokenValid,
  removeToken,
  setToken,
} from "@/lib/auth";
import type { AuthUser, LoginFormData } from "@/types";
import { getErrorMessage } from "@/lib/utils";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      const token = getToken();
      if (isTokenValid(token)) {
        setUser(getAuthUser());
      } else if (token) {
        removeToken();
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(
    async (data: LoginFormData) => {
      try {
        const response = await loginStudent({
          email: data.email,
          password: data.password,
        });

        if (!response.success || !response.data?.token) {
          throw new Error(response.message ?? "Login failed");
        }

        setToken(response.data.token, data.rememberMe);
        const authUser = getAuthUser();
        setUser(authUser);
        router.push("/dashboard");
      } catch (error) {
        throw new Error(getErrorMessage(error, "Login failed"));
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
