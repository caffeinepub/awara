import { ShoppingCart, Eye, Heart } from "lucide-react";
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
  const { addToCart, toggleWishlist, isWishlisted, getEffectivePrice, codEnabled } = useApp();
  const showCodBadge = codEnabled || !!product.codOverride;
  const wishlisted = isWishlisted(product.id);
  const effectivePrice = getEffectivePrice(product);
  const isDiscounted = effectivePrice < product.price;
  const discountBadgeText = isDiscounted
    ? product.price > 0
      ? `${Math.round((1 - effectivePrice / product.price) * 100)}% OFF`
      : ""
    : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: `₹${effectivePrice.toLocaleString("en-IN")}`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      description: product.name,
      icon: wishlisted ? "💔" : "❤️",
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

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-md transition-all duration-200 hover:scale-110 z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

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
        {isDiscounted && discountBadgeText && (
          <Badge className="absolute top-[2.2rem] left-2 bg-red-500 text-white text-xs">
            {discountBadgeText}
          </Badge>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-3 pointer-events-none">
            <span className="bg-gray-900/90 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
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

        {showCodBadge && (
          <Badge className="w-fit bg-green-600/90 text-white text-[10px] px-1.5 py-0.5 font-medium">
            COD Available
          </Badge>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground font-display">
              ₹{effectivePrice.toLocaleString("en-IN")}
            </span>
            {isDiscounted && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            className="gap-1 text-xs h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            title={!product.inStock ? "Out of stock" : undefined}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.inStock ? "Add" : "N/A"}
          </Button>
        </div>
      </div>
    </div>
  );
}
