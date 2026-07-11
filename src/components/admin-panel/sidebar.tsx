import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import Image from "next/image";

export function Sidebar({ role }: { role?: string }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-22" : "w-68",
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full px-2 py-4 shadow-md dark:shadow-zinc-800">
        <div className="pb-4">
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300 mb-1",
              sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
            )}
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex flex-wrap">
              <div>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={120}
                  height={100}
                  priority
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div
                className={cn(
                  "font-black whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                  sidebar?.isOpen === false
                    ? "-translate-x-96 opacity-0 hidden"
                    : "translate-x-0 opacity-100",
                )}
              >
                PT PESTA PORA ABADI
              </div>
            </Link>
          </Button>
        </div>
        <Menu isOpen={sidebar?.isOpen} role={role} />
      </div>
    </aside>
  );
}