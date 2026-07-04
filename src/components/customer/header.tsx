"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme/mode-toggle";
import { NavUser } from "../admin/nav-user";
import ShoppingCartIcon from "./shopping-cart-icon";
import { useUser } from "@/hooks/use-user";
import { logoutAction } from "@/actions/auth";

const DASHBOARD_ROLES = ["Owner", "Admin", "Staff"];

const Header = () => {
  const user = useUser();

  return (
    <nav className="px-8 py-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={20} height={20} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">WastingTime.</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        {user && DASHBOARD_ROLES.includes(user.role) && (
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full cursor-pointer">
              Dashboard
            </Button>
          </Link>
        )}
        <ShoppingCartIcon />
        <ModeToggle />
        {user ? (
          <NavUser user={user} onLogout={logoutAction} />
        ) : (
          <Link href="/login">
            <Button variant="outline" className="rounded-full cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;