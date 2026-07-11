import { RegisterForm } from "@/components/form/auth/register-form";
import { Header } from "@/components/header";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[95vw] md:max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
