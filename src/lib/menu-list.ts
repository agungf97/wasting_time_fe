import { LucideIcon } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  show?: boolean;
};

type MenuIcon = LucideIcon | string;

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: MenuIcon;
  show?: boolean;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  show?: boolean;
  menus: Menu[];
};

export function useMenuList(pathname: string, role?: string): Group[] {
  return [
    {
      groupLabel: "",
      show: role === "ADMIN",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: "/sidebar-icons/dashboard.svg",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Data Master",
      show: role === "ADMIN",
      menus: [
        {
          href: "/user",
          label: "User",
          active: pathname.includes("/user"),
          icon: "/sidebar-icons/users.svg",
          submenus: [],
        },
        {
          href: "/customer",
          label: "Customer",
          active: pathname.includes("/customer"),
          icon: "/sidebar-icons/service.png",
          submenus: [],
        },
      ],
    },
  ];
}
