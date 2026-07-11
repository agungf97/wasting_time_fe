"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";

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
import { forgotPasswordAction } from "@/actions/auth";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
});

type FormData = z.infer<typeof ForgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (form) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await forgotPasswordAction(form.email);
      if (!result.success) {
        setError(result.message ?? "Gagal mengirim email reset.");
        return;
      }
      setSubmittedEmail(form.email);
      setSubmitted(true);
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  });

  if (submitted) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Cek email Anda</h2>
            <p className="text-sm text-muted-foreground">
              Link reset kata sandi telah dikirim ke{" "}
              <span className="font-medium text-foreground">{submittedEmail}</span>.
              Periksa folder inbox atau spam.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Link berlaku selama <strong>15 menit</strong>.
          </p>
          <Link href="/login" className="w-full mt-2">
            <Button variant="outline" className="w-full cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Lupa Kata Sandi</CardTitle>
        <CardDescription>
          Masukkan email akun Anda. Kami akan mengirim link untuk reset kata
          sandi.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
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
                Mengirim...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Kirim Link Reset
              </span>
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