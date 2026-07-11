"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/actions/auth";

const ResetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, { message: "Kata sandi minimal 6 karakter" }),
    confirm_password: z
      .string()
      .min(6, { message: "Konfirmasi kata sandi minimal 6 karakter" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const onSubmit = handleSubmit(async (form) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await resetPasswordAction(
        token,
        form.new_password,
        form.confirm_password,
      );

      if (!result.success) {
        setError(result.message ?? "Gagal mengubah kata sandi.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  });

  if (success) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Kata sandi berhasil diubah</h2>
            <p className="text-sm text-muted-foreground">
              Silakan login dengan kata sandi baru Anda. Anda akan diarahkan
              otomatis dalam beberapa detik.
            </p>
          </div>
          <Link href="/login" className="w-full mt-2">
            <Button className="w-full cursor-pointer">Ke Halaman Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-lg bg-primary/10 p-2">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset Kata Sandi</CardTitle>
        </div>
        <CardDescription>
          Masukkan kata sandi baru Anda. Pastikan minimal 6 karakter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div
              className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/20"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new_password">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNew ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                {...register("new_password")}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? (
                  <EyeOff className="cursor-pointer h-4 w-4" />
                ) : (
                  <Eye className="cursor-pointer h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-xs text-red-500">{errors.new_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Konfirmasi Kata Sandi</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi kata sandi baru"
                {...register("confirm_password")}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!isDirty || !isValid || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Menyimpan...
              </span>
            ) : (
              "Simpan Kata Sandi Baru"
            )}
          </Button>

          <Link href="/login" className="block">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Button>
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}