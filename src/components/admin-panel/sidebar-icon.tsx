import Image from "next/image";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon | string;
  size?: number;
};

export function SidebarIcon({ icon, size = 18 }: Props) {
  if (typeof icon === "string") {
    return (
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <Image
            src={icon}
            alt="icon"
            fill
            sizes={`${size}px`}
            className="object-contain"
        />
      </div>
    );
  }

  const Icon = icon;
  return <Icon size={size} />;
}