import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarToggleProps } from "@/lib/interface/custom";

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-3 -right-4 z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-md w-8 h-8 cursor-pointer"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700 cursor-pointer",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
