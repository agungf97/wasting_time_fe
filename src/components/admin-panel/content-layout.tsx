import { Navbar } from "@/components/admin-panel/navbar";
import { ContentLayoutProps } from "@/lib/interface/custom";
import { cookies } from "next/headers";
import { ClientOnly } from "../client-only";

export async function ContentLayout({ children }: ContentLayoutProps) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;
  const name = cookieStore.get("name")?.value;
  const email = cookieStore.get("email")?.value;

  return (
    <ClientOnly>
      <Navbar isLoggedIn={isLoggedIn} role={role} name={name} email={email} />
      <div className="p-6">{children}</div>
    </ClientOnly>
  );
}