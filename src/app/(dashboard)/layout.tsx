import AppSidebar from "@/components/admin/app-sidebar";
import Navbar from "@/components/admin/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
            <Navbar />
            <div className="p-4">
                {children}
            </div>
        </main>
    </SidebarProvider>
  );
}
