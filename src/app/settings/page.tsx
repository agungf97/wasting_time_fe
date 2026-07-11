import { SettingsClient } from "@/components/setting-client";
import { Header } from "@/components/header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const initialData = {
    full_name: cookieStore.get("name")?.value ?? "",
    username: cookieStore.get("username")?.value ?? "",
    email: cookieStore.get("email")?.value ?? "",
    phone_number: cookieStore.get("phone_number")?.value ?? "",
  };
  const role = cookieStore.get("role")?.value ?? "";

  return (
    <main className="w-full">
      <Header />
      <div className="p-4">
        <SettingsClient initialData={initialData} role={role} />
      </div>
    </main>
  );
}