"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import ShoppingCartIcon from "@/components/shopping-cart-icon";
import { useUser } from "@/hooks/use-user";

const DASHBOARD_ROLES = ["OWNER", "ADMIN", "STAFF"];

interface HeaderProps {
  variant?: "admin" | "public";
}

export function Header({ variant = "public" }: HeaderProps) {
  const user = useUser();
  const isAdmin = variant === "admin";

  return (
    <header
      className={
        isAdmin
          ? "sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-backdrop-filter:bg-background/60 dark:shadow-secondary"
          : "sticky top-0 z-10 bg-background border-b"
      }
    >
      <div
        className={
          isAdmin
            ? "mx-4 sm:mx-8 flex justify-between h-14 items-center"
            : "px-8 py-4 flex items-center justify-between"
        }
      >
        <div className="flex items-center space-x-4 lg:space-x-0">
          {isAdmin ? (
            <SheetMenu role={user?.role} />
          ) : (
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={20} height={20} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">WastingTime.</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div
          className={
            isAdmin
              ? "flex flex-2 items-center justify-end gap-2"
              : "flex items-center justify-end gap-2 sm:gap-4"
          }
        >
          {!isAdmin && user && DASHBOARD_ROLES.includes(user.role) && (
            <Button asChild variant="outline" className="rounded-full cursor-pointer">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          {!isAdmin && <ShoppingCartIcon />}
          <ModeToggle />
          {user ? (
            <UserNav name={user.full_name} email={user.email} />
          ) : (
            <Button asChild variant="outline" className="rounded-full cursor-pointer">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}