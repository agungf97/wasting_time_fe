'use client'

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { changePasswordAction } from "@/actions/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password minimal 6 karakter"),
  newPassword: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordInline() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const result = await changePasswordAction({
      password_sekarang: data.currentPassword,
      password_baru: data.newPassword,
      password_baru_repeat: data.confirmPassword,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    toast.success(result.message || "Password berhasil diubah");
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Ganti Password</h2>
        <p className="text-sm text-muted-foreground">Keamanan akun</p>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
        <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary">Keamanan Password</p>
          <p className="text-sm text-primary/80">
            Gunakan password yang kuat dan unik. Jangan gunakan password yang sama di layanan lain.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Password Saat Ini</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              placeholder="Masukkan password saat ini"
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentPassword")}
              className={errors.currentPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4 cursor-pointer text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 cursor-pointer text-gray-500" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="text-sm text-red-500">{errors.currentPassword.message}</span>
          )}
        </div>

        <div className="relative flex items-center py-1">
          <div className="flex-1 border-t border-dashed" />
          <span className="px-3 text-xs text-muted-foreground">Password Baru</span>
          <div className="flex-1 border-t border-dashed" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Password Baru</Label>
          <div className="relative">
            <Input
              id="newPassword"
              placeholder="Masukkan password baru"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword")}
              className={errors.newPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4 cursor-pointer text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 cursor-pointer text-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-sm text-red-500">{errors.newPassword.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="Ulangi password baru"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 cursor-pointer text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 cursor-pointer text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Memperbarui..." : "Perbarui Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}