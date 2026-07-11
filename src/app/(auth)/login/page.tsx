import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/form/auth/login-form";

export default async function LoginPage() {

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
        <div className="w-full max-w-[95vw] md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
