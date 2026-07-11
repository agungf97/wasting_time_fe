"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/actions/auth";
import { useState } from "react";
import Image from "next/image";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    const result = await registerAction({
      email: formData.get("email") as string,
      password,
      full_name: formData.get("full_name") as string,
      phone_number: formData.get("phone_number") as string,
    });

    // registerAction akan redirect ke /login jika berhasil
    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Buat akun baru</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Isi data di bawah untuk mendaftar
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="full_name">Nama Lengkap</FieldLabel>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone_number">No. Handphone</FieldLabel>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="081234567890"
                  required
                />
              </Field>

              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm_password">
                      Konfirmasi Password
                    </FieldLabel>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      required
                    />
                  </Field>
                </div>
                <FieldDescription>Minimal 8 karakter.</FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </span>
                  ) : (
                    "Buat Akun"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Sudah punya akun?{" "}
                <a href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              fill
              priority
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Dengan mendaftar, kamu setuju dengan{" "}
        <a href="/terms" className="underline underline-offset-4">Terms of Service</a>{" "}
        dan{" "}
        <a href="/privacy" className="underline underline-offset-4">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}