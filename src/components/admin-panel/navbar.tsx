'use client';

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { Button } from "../ui/button";
import Link from "next/link";
// import { NotificationBell } from "@/components/notification-bell";

interface NavbarProps {
  isLoggedIn: boolean;
  role?: string;
  name?: string;
  email?: string;
}

export function Navbar({ isLoggedIn, role, name, email }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-backdrop-filter:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex justify-between h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu role={role} />
        </div>
        <div className="flex flex-2 items-center justify-end gap-2">
          <ModeToggle />
          {isLoggedIn ? (
            <>
              {/* <NotificationBell /> */}
              <UserNav name={name} email={email} />
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full cursor-pointer">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}