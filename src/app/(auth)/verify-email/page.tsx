import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { EmailVerificationForm } from "@/components/form/auth/email-verification-form";
import { verifyEmailAction } from "@/actions/auth";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token?.trim();
  const email = params.email?.trim();
  let statusType: "info" | "error" = "info";
  let statusMessage =
    "Registrasi berhasil. Kami telah mengirim email verifikasi. Jika belum menerima, kirim ulang email verifikasi di bawah.";

  if (email) {
    statusMessage = `Registrasi berhasil. Kami telah mengirim email verifikasi ke ${email}. Jika belum menerima, kirim ulang email verifikasi di bawah.`;
  }

  if (token) {
    const result = await verifyEmailAction(token);
    if (result.success) {
      redirect("/login?verified=1");
    }

    statusType = "error";
    statusMessage = result.message ?? "Verifikasi email gagal.";
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
        <div className="w-full max-w-[95vw] md:max-w-md">
          <EmailVerificationForm
            defaultEmail={email}
            statusType={statusType}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    </div>
  );
}