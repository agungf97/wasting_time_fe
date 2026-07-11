"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MenuProps } from "@/lib/interface/custom";
import { SidebarIcon } from "./sidebar-icon";

interface MenuComponentProps extends MenuProps {
  role?: string;
}

export function Menu({ isOpen, role }: MenuComponentProps) {
  const pathname = usePathname();
  const menuList = useMenuList(pathname, role);

  return (
    <ScrollArea type="auto" className="[&>div>div[style]]:block! h-[calc(100vh-48px-36px-16px-32px)] lg:h-[calc(100vh-32px-40px-32px)]">
      <nav className="mt-4 h-full w-full">
        <ul className="flex flex-col items-start space-y-1 px-2">
          {menuList
            .filter((group) => group.show !== false)
            .map(({ groupLabel, menus, show }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "", show ? "" : "hidden")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 max-w-62 truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
                {menus.map(({ href, label, icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className={cn("w-full")} key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-10 mb-1",
                                active && "sidebar-rainbow-active"
                              )}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <SidebarIcon icon={icon} size={20} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-50 line-clamp-2 whitespace-normal leading-tight",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100",
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}