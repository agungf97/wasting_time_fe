import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "@/components/form/auth/forgot-password-form";
import { ResetPasswordForm } from "@/components/form/auth/reset-password-form";
import { validateTokenAction } from "@/actions/auth";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

  let content: React.ReactNode;

  if (!token) {
    content = <ForgotPasswordForm />;
  } else {
    const { valid, error } = await validateTokenAction(token);

    if (!valid) {
      content = (
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/30">
              <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Link Tidak Valid</h2>
              <p className="text-sm text-muted-foreground">
                {error ??
                  "Token reset kata sandi tidak valid atau sudah kedaluwarsa."}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Silakan minta link reset baru melalui halaman lupa kata sandi.
            </p>
            <Link href="/reset-password" className="w-full mt-2">
              <Button className="w-full cursor-pointer">
                Minta Link Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    } else {
      content = <ResetPasswordForm token={token} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="z-50 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/60 border-border/40">
        <div className="h-14 flex items-center px-4 md:px-6">
          <Link href="/">
            <div className="flex flex-col items-center space-y-1">
              <Image
                src="/logo.png"
                alt="Logo"
                width={0}
                height={0}
                sizes="64px"
                priority
                style={{ width: "64px", height: "auto" }}
              />
              <div className="text-[8px] font-bold">PT. PESTA PORA ABADI</div>
            </div>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[95vw] md:max-w-md">{content}</div>
      </div>
    </div>
  );
}