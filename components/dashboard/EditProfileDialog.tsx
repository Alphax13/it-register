"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { updateStudentProfile } from "@/lib/api";
import type { Student } from "@/types";
import { getErrorMessage } from "@/lib/utils";

const editProfileSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  phoneNumber: z
    .string()
    .regex(/^0[0-9]{8,9}$/, "Invalid phone number"),
  address: z.string().min(5, "Address is too short").max(500),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function EditProfileDialog({
  student,
  onUpdate,
}: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      nickname: student.nickname,
      phoneNumber: student.phoneNumber,
      address: student.address,
    },
  });

  const { control, handleSubmit, reset } = form;

  function handleOpen() {
    reset({
      nickname: student.nickname,
      phoneNumber: student.phoneNumber,
      address: student.address,
    });
    setIsOpen(true);
  }

  async function onSubmit(data: EditProfileFormData) {
    setIsSaving(true);
    try {
      const updated = await updateStudentProfile(data);
      onUpdate(updated);
      setIsOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Pencil className="size-4" />
        Edit Profile
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSaving && setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h2 id="edit-profile-title" className="text-lg font-semibold">
          Edit Profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your contact information
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FieldGroup>
            <Controller
              name="nickname"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Nickname</FieldLabel>
                  <FieldContent>
                    <Input {...field} aria-invalid={!!fieldState.error} />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <FieldContent>
                    <Input {...field} aria-invalid={!!fieldState.error} />
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
                  <FieldLabel>Address</FieldLabel>
                  <FieldContent>
                    <Input {...field} aria-invalid={!!fieldState.error} />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
