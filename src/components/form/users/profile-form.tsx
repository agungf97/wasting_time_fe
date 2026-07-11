'use client'

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateUserAction } from "@/actions/user";

const profileSchema = z.object({
  full_name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid"),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  role: string;
  initialData?: Partial<ProfileFormValues>;
}

export function ProfileForm({ role, initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      username: initialData?.username ?? "",
      email: initialData?.email ?? "",
      phone_number: initialData?.phone_number ?? "",
    },
  });

  const initials = (initialData?.full_name ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const onSubmit = async (data: ProfileFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const result = await updateUserAction({
      ...data,
      role,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success(result.message || "Profil berhasil diperbarui");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Data Pengguna</h2>
        <p className="text-sm text-muted-foreground">Nama, email, telepon</p>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {initials || "??"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{initialData?.full_name || "Pengguna"}</p>
          <p className="text-xs text-muted-foreground">{initialData?.email || "-"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              className={errors.full_name ? "border-red-500" : ""}
            />
            {errors.full_name && (
              <span className="text-sm text-red-500">{errors.full_name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">Digunakan untuk login dan URL profil</p>
            {errors.username && (
              <span className="text-sm text-red-500">{errors.username.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Nomor Telepon</Label>
            <Input
              id="phone_number"
              {...register("phone_number")}
              className={errors.phone_number ? "border-red-500" : ""}
            />
            {errors.phone_number && (
              <span className="text-sm text-red-500">{errors.phone_number.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}