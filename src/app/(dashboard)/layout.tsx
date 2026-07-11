import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

const DASHBOARD_ROLES = ["OWNER", "ADMIN", "STAFF"] as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token) {
    redirect("/login");
  }

  const normalizedRole = role?.trim().toUpperCase();

  if (!normalizedRole || !DASHBOARD_ROLES.includes(normalizedRole as typeof DASHBOARD_ROLES[number])) {
    redirect("/");
  }

  return (
    <AdminPanelLayout role={normalizedRole}>
      {children}
    </AdminPanelLayout>
  );
}