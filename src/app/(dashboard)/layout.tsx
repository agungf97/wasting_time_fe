import { cookies } from "next/headers";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
// import { PushNotificationInitializer } from "@/components/push-notification-initializer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  return (
    <AdminPanelLayout role={role}>
      {/* <PushNotificationInitializer /> */}
      {children}
    </AdminPanelLayout>
  );
}