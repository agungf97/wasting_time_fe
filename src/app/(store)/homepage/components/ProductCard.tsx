"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useCartStore, { ProductType } from "@/hooks/use-store";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0],
    color: product.colors[0],
  });

  const { addToCart } = useCartStore();

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
    });
    toast.success("Product added to cart");
  };

  return (
    <Card className="overflow-hidden gap-0 py-0">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-2/3">
          <Image
            src={product.images[productTypes.color]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>
      </Link>

      {/* PRODUCT DETAIL */}
      <CardContent className="flex flex-col gap-4 p-4">
        <div>
          <h2 className="font-medium">{product.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* PRODUCT TYPES */}
        <div className="flex items-center gap-4 text-xs">
          {/* SIZES */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-muted-foreground">Size</span>
            <Select
              value={productTypes.size}
              onValueChange={(value) =>
                handleProductType({ type: "size", value })
              }
            >
              <SelectTrigger className="h-8 text-xs cursor-pointer">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size}
                    className="text-xs cursor-pointer"
                  >
                    {size.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* COLORS */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Color</span>
            <div className="flex items-center gap-2 h-8">
              {product.colors.map((color) => (
                <Tooltip key={color}>
                  <TooltipTrigger asChild>
                    <button
                      className={`rounded-full p-0.5 border-2 transition-all cursor-pointer ${
                        productTypes.color === color
                          ? "border-foreground"
                          : "border-transparent"
                      }`}
                      onClick={() =>
                        handleProductType({ type: "color", value: color })
                      }
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{color}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* PRICE AND ADD TO CART BUTTON */}
      <CardFooter className="flex items-center justify-between px-4 pb-4">
        <Badge variant="secondary" className="text-sm font-semibold px-2 py-1">
          ${product.price.toFixed(2)}
        </Badge>
        <Button
          onClick={handleAddToCart}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;