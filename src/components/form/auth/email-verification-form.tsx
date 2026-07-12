"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info, Loader2, Mail, Send, XCircle } from "lucide-react";

import { resendVerificationAction } from "@/actions/auth";
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

interface EmailVerificationFormProps {
  defaultEmail?: string;
  statusType: "info" | "error";
  statusMessage: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function EmailVerificationForm({
  defaultEmail,
  statusType,
  statusMessage,
}: EmailVerificationFormProps) {
  const [resendEmail, setResendEmail] = useState(defaultEmail ?? "");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendError, setResendError] = useState<string>("");

  const canResend = useMemo(
    () => !resendLoading && isValidEmail(resendEmail),
    [resendEmail, resendLoading],
  );

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidEmail(resendEmail)) {
      setResendError("Format email tidak valid.");
      setResendMessage("");
      return;
    }

    setResendLoading(true);
    setResendError("");
    setResendMessage("");

    try {
      const result = await resendVerificationAction(resendEmail.trim());
      if (!result.success) {
        setResendError(result.message ?? "Gagal mengirim ulang email verifikasi.");
        return;
      }

      setResendMessage(
        result.message ??
          "Email verifikasi berhasil dikirim ulang. Silakan cek inbox atau spam.",
      );
    } catch {
      setResendError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
        <CardDescription>
          {statusType === "error"
            ? "Link verifikasi gagal diproses. Anda dapat mengirim ulang email verifikasi."
            : "Silakan cek email Anda untuk melanjutkan verifikasi akun."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            {statusType === "error" ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Info className="h-4 w-4 text-blue-500" />
            )}
            Status Verifikasi
          </div>
          <p
            className={`text-sm ${
              statusType === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {statusMessage}
          </p>
        </div>

        <form onSubmit={handleResend} className="space-y-3 border-t pt-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Kirim Ulang Verifikasi
          </div>
          <Label htmlFor="resend-email">Email</Label>
          <Input
            id="resend-email"
            type="email"
            placeholder="nama@email.com"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            disabled={resendLoading}
          />

          {resendError && (
            <p className="rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-300">
              {resendError}
            </p>
          )}
          {resendMessage && (
            <p className="rounded-md bg-green-50 p-2 text-xs text-green-600 dark:bg-green-900/20 dark:text-green-300">
              {resendMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="outline"
            className="w-full cursor-pointer"
            disabled={!canResend}
          >
            {resendLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Kirim Ulang Verifikasi
              </span>
            )}
          </Button>
        </form>

        <Link href="/login" className="block">
          <Button className="w-full cursor-pointer" variant="ghost">
            Kembali ke Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}