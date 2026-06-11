"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import { registerSchema } from "@/lib/validation";
import { registerStudent } from "@/lib/api";
import { useAvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import { PasswordInput } from "@/components/register/PasswordInput";
import { PasswordStrengthMeter } from "@/components/register/PasswordStrengthMeter";
import { AvailabilityIndicator } from "@/components/register/AvailabilityIndicator";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { cn, getErrorMessage } from "@/lib/utils";
import { z } from "zod";

type FormValues = z.input<typeof registerSchema>;

const inputClassName =
  "h-11 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-orange-200/50 focus-visible:border-orange-400/50 focus-visible:ring-orange-400/20 dark:bg-white/5";

const textareaClassName =
  "w-full min-h-[88px] resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-orange-200/50 focus-visible:border-orange-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/20 dark:bg-white/5";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    studentCode: string;
    fullName: string;
    email: string;
  } | null>(null);

  const form = useForm<z.input<typeof registerSchema>, unknown, z.output<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      studentCode: "",
      fullName: "",
      nickname: "-",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      birthDate: "",
      nationalId: "",
      address: "",
      previousSchool: "",
      qualification: undefined,
      studyPlan: "",
      guardianName: "",
      guardianPhone: "",
      curriculum: undefined,
      cohortYear: "",
      section: "IT",
      classGroup: "",
      yearLevel: "1",
      academicYear: "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const studentCode = useWatch({ control, name: "studentCode" }) ?? "";
  const email = useWatch({ control, name: "email" }) ?? "";
  const password = useWatch({ control, name: "password" }) ?? "";
  const cohortYear = useWatch({ control, name: "cohortYear" }) ?? "";

  useEffect(() => {
    if (studentCode.length >= 2) {
      const prefix = studentCode.substring(0, 2);
      const year = parseInt(prefix, 10);
      if (!isNaN(year) && year >= 60 && year <= 80) {
        setValue("cohortYear", `25${prefix}`, { shouldValidate: true });
      }
    }
  }, [studentCode, setValue]);

  const studentCodeCheck = useAvailabilityCheck({
    value: studentCode,
    type: "studentCode",
    enabled: studentCode.length >= 10 && !errors.studentCode,
  });

  const emailCheck = useAvailabilityCheck({
    value: email,
    type: "email",
    enabled: !!email && !errors.email,
  });

  const isAvailabilityBlocked =
    studentCodeCheck.status === "checking" ||
    emailCheck.status === "checking";

  function getRegisterErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status?: number }).status;
      if (status === 409) {
        return "ข้อมูลซ้ำในระบบ (รหัสนักศึกษา หรือ อีเมล ถูกใช้งานแล้ว)";
      }
    }
    return getErrorMessage(error, "ลงทะเบียนไม่สำเร็จ");
  }

  async function onSubmit(data: z.output<typeof registerSchema>) {
    if (studentCodeCheck.status === "taken" || emailCheck.status === "taken") {
      toast.error("กรุณาแก้ไขข้อมูลที่ซ้ำกันก่อนส่งฟอร์ม");
      return;
    }

    setIsSubmitting(true);

    try {
      const resolvedCohortYear = data.cohortYear ?? "";
      const resolvedAcademicYear =
        data.academicYear?.trim() ||
        resolvedCohortYear ||
        String(new Date().getFullYear() + 543);
      const parsedCohortYear = parseInt(resolvedCohortYear, 10);

      const response = await registerStudent({
        studentCode: data.studentCode,
        fullName: data.fullName,
        nickname: data.nickname ?? "",
        email: data.email,
        password: data.password,
        // EduTrack legacy mapping: yearLevel stores admission Buddhist year
        yearLevel: Number.isNaN(parsedCohortYear)
          ? parseInt(resolvedAcademicYear, 10)
          : parsedCohortYear,
        // EduTrack legacy mapping: classGroupLabel is major/department label
        classGroupLabel: "เทคโนโลยีสารสนเทศ",
        type: data.curriculum,
        // EduTrack legacy mapping: section is room/group number (e.g. 1, 2, A, B)
        section: data.classGroup ?? "",
        cohortYear: resolvedCohortYear,
        academicYear: resolvedAcademicYear,
        phoneNumber: data.phoneNumber.replace(/-/g, ""),
        birthDate: data.birthDate,
        nationalId: data.nationalId,
        address: data.address,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone.replace(/-/g, ""),
        previousSchool: data.previousSchool,
        studyPlan: data.studyPlan,
        educationalQualification: data.qualification,
      });

      if (!response.success) {
        throw new Error(response.message ?? "Registration failed");
      }

      const successData = {
        studentCode: response.data?.studentCode ?? data.studentCode,
        fullName: response.data?.fullName ?? data.fullName,
        email: response.data?.email ?? data.email,
      };

      sessionStorage.setItem("register_success", JSON.stringify(successData));
      setSuccessInfo(successData);
      setIsSuccessModalOpen(true);
    } catch (error) {
      toast.error(getRegisterErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onInvalid() {
    toast.error("กรุณาตรวจสอบข้อมูลที่กรอกให้ครบและถูกต้อง");
  }

  function goToSuccessPage() {
    setIsSuccessModalOpen(false);
    router.push("/register/success");
  }

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isSubmitting} />

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <FieldGroup>
          <div className="mb-1 border-b border-white/10 pb-3">
            <p className="text-xs font-semibold tracking-wider text-orange-300/90 uppercase">
              ข้อมูลส่วนตัว
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">ชื่อ-นามสกุล *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="นาย/นาง/นางสาว ชื่อ นามสกุล"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="nickname"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">ชื่อเล่น</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น บอล, ฝน, มิว"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="studentCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">รหัสนักศึกษา *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น 66130500001"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <AvailabilityIndicator
                      status={studentCodeCheck.status}
                      message={studentCodeCheck.message}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">อีเมล *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      type="email"
                      placeholder="admin@example.com"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <AvailabilityIndicator
                      status={emailCheck.status}
                      message={emailCheck.message}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">เบอร์โทรศัพท์ *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น 081-234-5678"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="birthDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">วันเดือนปีเกิด *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      type="date"
                      className={cn(inputClassName, "scheme-dark")}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="nationalId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">เลขบัตรประชาชน *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น 1234567890123"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Field>
              <FieldLabel className="text-orange-100">สาขาวิชา *</FieldLabel>
              <FieldContent>
                <Input
                  value="เทคโนโลยีสารสนเทศ"
                  readOnly
                  disabled
                  className={cn(inputClassName, "cursor-not-allowed opacity-70")}
                />
              </FieldContent>
            </Field>
          </div>

          <Controller
            name="classGroup"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="text-orange-100">กลุ่มเรียน</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="เช่น 1, 2, 3"
                    className={inputClassName}
                    aria-invalid={!!fieldState.error}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="text-orange-100">ที่อยู่ (ตามทะเบียนบ้าน) *</FieldLabel>
                <FieldContent>
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="บ้านเลขที่ หมู่ที่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                    className={cn(textareaClassName, fieldState.error && "border-red-400")}
                    aria-invalid={!!fieldState.error}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <div className="mt-2 mb-1 border-b border-white/10 pb-3">
            <p className="text-xs font-semibold tracking-wider text-orange-300/90 uppercase">
              ข้อมูลการเรียน
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="previousSchool"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">สถานศึกษาเดิม *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น โรงเรียนพิจิตรพิทยาคม"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="qualification"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">คุณวุฒิ *</FieldLabel>
                  <FieldContent>
                    <div className="mt-1 space-y-2">
                      {(["ม.6", "ปวช.", "ปวส."] as const).map((q) => (
                        <label key={q} className="flex cursor-pointer items-center gap-2.5">
                          <input
                            type="radio"
                            value={q}
                            checked={field.value === q}
                            onChange={() => field.onChange(q)}
                            className="h-4 w-4 accent-orange-400"
                          />
                          <span className="text-sm text-white">{q}</span>
                        </label>
                      ))}
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="studyPlan"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">แผนการเรียน *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น แผนการเรียนภาษาอังกฤษ-คณิตศาสตร์"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="curriculum"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">หลักสูตร *</FieldLabel>
                  <FieldContent>
                    <div className="mt-1 space-y-2">
                      {([
                        ["REGULAR", "4 ปี"],
                        ["TRANSFER", "เทียบโอน"],
                      ] as const).map(([val, label]) => (
                        <label key={val} className="flex cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={field.value === val}
                            onChange={() =>
                              field.onChange(field.value === val ? undefined : val)
                            }
                            className="h-4 w-4 accent-orange-400"
                          />
                          <span className="text-sm text-white">{label}</span>
                        </label>
                      ))}
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <Field>
            <FieldLabel className="text-orange-100">
              รุ่น (ปีที่เข้าศึกษา) ดูจากเลขหน้ารหัสนักศึกษา *
            </FieldLabel>
            <FieldContent>
              <Input
                value={cohortYear}
                readOnly
                disabled={!cohortYear}
                placeholder="จะกรอกอัตโนมัติเมื่อกรอกรหัสนักศึกษา"
                className={cn(inputClassName, cohortYear ? "opacity-80" : "opacity-50")}
              />
            </FieldContent>
          </Field>

          <div className="mt-2 mb-1 border-b border-white/10 pb-3">
            <p className="text-xs font-semibold tracking-wider text-orange-300/90 uppercase">
              ข้อมูลผู้ปกครอง
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="guardianName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">ชื่อผู้ปกครอง *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="นาย/นาง/นางสาว ชื่อ นามสกุล"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="guardianPhone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">เบอร์โทรผู้ปกครอง *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="เช่น 081-234-5678"
                      className={inputClassName}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">รหัสผ่าน *</FieldLabel>
                  <FieldContent>
                    <PasswordInput {...field} aria-invalid={!!fieldState.error} />
                    <PasswordStrengthMeter password={password} />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="text-orange-100">ยืนยันรหัสผ่าน *</FieldLabel>
                  <FieldContent>
                    <PasswordInput {...field} aria-invalid={!!fieldState.error} />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        <motion.div
          className="mt-8"
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || isAvailabilityBlocked}
            className="h-12 w-full rounded-2xl bg-orange-500 text-base font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400 disabled:opacity-60"
          >
            ลงทะเบียน
          </Button>
        </motion.div>
      </form>

      {isSuccessModalOpen && successInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900/95 p-6 shadow-2xl"
          >
            <h3 id="register-success-title" className="text-2xl font-bold text-white">
              ลงทะเบียนสำเร็จ
            </h3>
            <p className="mt-2 text-sm text-orange-100">
              บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
            </p>

            <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="text-zinc-300">
                รหัสนักศึกษา: <span className="font-semibold text-white">{successInfo.studentCode}</span>
              </p>
              <p className="text-zinc-300">
                ชื่อ-นามสกุล: <span className="font-semibold text-white">{successInfo.fullName}</span>
              </p>
              <p className="text-zinc-300">
                อีเมล: <span className="font-semibold text-white">{successInfo.email}</span>
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                ปิด
              </Button>
              <Button
                type="button"
                className="bg-orange-500 text-white hover:bg-orange-400"
                onClick={goToSuccessPage}
              >
                ไปหน้าสำเร็จ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
