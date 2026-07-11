import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Image from "next/image";
import { VisuallyHidden } from "../visually-hidden";

export function SheetMenu({ role }: { role?: string }) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8 cursor-pointer" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SheetDescription>Sidebar navigasi utama aplikasi</SheetDescription>
            <Button className="transition-transform ease-in-out duration-300 mb-1"
              variant="link"
              asChild
            >
              <Link href="/" className="flex flex-wrap">
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
                <div className="font-black whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300">
                  PT PESTA PORA ABADI
                </div>
              </Link>
            </Button>
          </SheetHeader>
        </VisuallyHidden>
        <Menu isOpen role={role} />
      </SheetContent>
    </Sheet>
  );
}