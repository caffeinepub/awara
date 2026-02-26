import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import type { Product } from "../types";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: `₹${product.price.toLocaleString("en-IN")}`,
    });
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 font-medium shadow-md"
            onClick={() => onViewDetail(product)}
          >
            <Eye className="h-4 w-4" />
            Quick View
          </Button>
        </div>

        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
          {product.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <button
          type="button"
          className="font-semibold text-sm font-display text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-left w-full"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </button>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-foreground font-display">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <Button
            size="sm"
            className="gap-1 text-xs h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
