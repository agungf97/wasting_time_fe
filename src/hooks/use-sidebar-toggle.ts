import { SidebarToggleProps } from "@/lib/interface/custom";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSidebarToggle = create(
  persist<SidebarToggleProps>(
    (set, get) => ({
      isOpen: true,
      setIsOpen: () => {
        set({ isOpen: !get().isOpen });
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
