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

const INTERNAL_ROLES = ["ADMIN", "OWNER", "STAFF"];

export function useMenuList(pathname: string, role?: string): Group[] {
  const isInternal = !!role && INTERNAL_ROLES.includes(role);

  return [
    {
      groupLabel: "",
      show: isInternal,
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
      show: isInternal,
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
    {
      groupLabel: "Katalog",
      show: isInternal,
      menus: [
        {
          href: "/product",
          label: "Product",
          active: pathname.includes("/product"),
          icon: "/sidebar-icons/products.png",
          submenus: [],
        },
        {
          href: "/voucher",
          label: "Voucher",
          active: pathname.includes("/voucher"),
          icon: "/sidebar-icons/coupon.png",
          submenus: [],
        },
      ],
    },
  ];
}
