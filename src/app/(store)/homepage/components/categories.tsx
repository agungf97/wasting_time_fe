"use client";
import {
  Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  Venus,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "All", icon: <ShoppingBasket className="w-4 h-4" />, slug: "all" },
  { name: "T-shirts", icon: <Shirt className="w-4 h-4" />, slug: "t-shirts" },
  { name: "Shoes", icon: <Footprints className="w-4 h-4" />, slug: "shoes" },
  { name: "Accessories", icon: <Glasses className="w-4 h-4" />, slug: "accessories" },
  { name: "Bags", icon: <Briefcase className="w-4 h-4" />, slug: "bags" },
  { name: "Dresses", icon: <Venus className="w-4 h-4" />, slug: "dresses" },
  { name: "Jackets", icon: <Shirt className="w-4 h-4" />, slug: "jackets" },
  { name: "Gloves", icon: <Hand className="w-4 h-4" />, slug: "gloves" },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap justify-between px-6 bg-muted p-2 rounded-lg mb-4">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant={category.slug === selectedCategory ? "default" : "ghost"}
          size="sm"
          className="cursor-pointer"
          onClick={() => handleChange(category.slug)}
        >
          {category.icon}
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;