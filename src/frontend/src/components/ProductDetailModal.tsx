import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Product } from "../types";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const MOCK_REVIEWS = [
  {
    id: "r1",
    author: "Priya S.",
    rating: 5,
    comment: "Excellent quality! Exactly as described. Very happy with the purchase.",
    date: "2 days ago",
  },
  {
    id: "r2",
    author: "Rahul M.",
    rating: 4,
    comment: "Good product, fast delivery. Would recommend to others.",
    date: "1 week ago",
  },
  {
    id: "r3",
    author: "Anjali K.",
    rating: 4,
    comment: "Value for money. Packaging was nice and product looks exactly like the photos.",
    date: "2 weeks ago",
  },
];

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      description: `Total: ₹${(product.price * quantity).toLocaleString("en-IN")}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 sm:h-full object-cover"
            />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {product.category}
            </Badge>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-display text-left leading-tight">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />

            <div className="text-3xl font-bold font-display text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart — ₹{(product.price * quantity).toLocaleString("en-IN")}
            </Button>
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6 border-t border-border">
          <h3 className="font-semibold font-display mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground shrink-0">
                  {review.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{review.author}</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
