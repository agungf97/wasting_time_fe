'use client'

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Key } from "lucide-react";
import { changePasswordAction } from "@/actions/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password minimal 6 karakter"),
  newPassword: z.string()
    .min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema)
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setServerMessage(null);
    setOpen(true);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      reset();
      setServerMessage(null);
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerMessage(null);

    const result = await changePasswordAction({
      password_sekarang: data.currentPassword,
      password_baru: data.newPassword,
      password_baru_repeat: data.confirmPassword,
    });

    setIsSubmitting(false);
    setServerMessage({ type: "error", text: result.message });
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full"
      >
        <Key className="w-4 h-4 mr-3 text-muted-foreground" />
        <span>Change Password</span>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="flex flex-col max-h-[90vh] p-0 gap-0 overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>Ubah Kata Sandi</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Silakan masukkan kata sandi Anda saat ini dan kata sandi baru untuk mengubah kata sandi akun Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.stopPropagation();
              }}
              className="space-y-4"
            >
              {serverMessage && (
                <p
                  className={`text-sm rounded-md px-3 py-2 ${
                    serverMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {serverMessage.text}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    placeholder="Masukkan kata sandi Anda saat ini"
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

              <div className="space-y-2">
                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    placeholder="Masukkan kata sandi baru Anda"
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
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Konfirmasi kata sandi baru Anda"
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

              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Mengubah Password..." : "Change Password"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}