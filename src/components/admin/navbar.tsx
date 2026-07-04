"use client";

import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme/mode-toggle";
import { NavUser } from "./nav-user";
import { useUser } from "@/hooks/use-user";
import { logoutAction } from "@/actions/auth";

const Navbar = () => {
  const user = useUser();

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      <SidebarTrigger className="cursor-pointer" />
      <div className="flex items-center gap-4">
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

export default Navbar;