"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import useCartStore from "@/hooks/use-store";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();

  if (!hasHydrated) return null;
  return (
    <Link href="/cart" className="relative">
        <Button variant="outline" size="icon" className="cursor-pointer rounded-full">
            <ShoppingCart className="w-4 h-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
        </Button>
    </Link>
  );
};

export default ShoppingCartIcon;
