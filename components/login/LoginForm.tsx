"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/register/PasswordInput";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import type { LoginFormData } from "@/types";
import { getErrorMessage } from "@/lib/utils";

const inputClassName =
  "h-11 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-blue-200/50 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20 dark:bg-white/5";

export function LoginForm() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isSubmitting} message="Signing in..." />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="text-blue-100">Email</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="email"
                    placeholder="student@university.ac.th"
                    className={inputClassName}
                    aria-invalid={!!fieldState.error}
                    autoComplete="email"
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="text-blue-100">Password</FieldLabel>
                <FieldContent>
                  <PasswordInput
                    {...field}
                    aria-invalid={!!fieldState.error}
                    autoComplete="current-password"
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <div className="flex items-center justify-between">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/30 data-checked:bg-cyan-500 data-checked:text-white"
                  />
                  <span className="text-sm text-blue-100">Remember Me</span>
                </label>
              )}
            />

            <Link
              href="/login"
              className="text-sm text-cyan-300 transition hover:text-cyan-200"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Password reset coming soon");
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </FieldGroup>

        <motion.div
          className="mt-8"
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="h-12 w-full rounded-2xl bg-white text-base font-bold text-blue-700 shadow-lg hover:bg-blue-50 disabled:opacity-60"
          >
            Sign In
          </Button>
        </motion.div>

        <p className="mt-6 text-center text-sm text-blue-200">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
