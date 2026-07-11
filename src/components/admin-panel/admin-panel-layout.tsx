"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";

export default function AdminPanelLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar role={role} />
      <main
        className={cn(
          "min-h-[calc(100vh-56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-22.5" : "lg:ml-68",
        )}
      >
        {children}
      </main>
    </>
  );
}