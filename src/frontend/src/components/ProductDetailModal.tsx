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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus, Heart, Star } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Product } from "../types";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-100 hover:scale-110 focus-visible:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 transition-colors duration-100 ${
                active
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="text-sm text-muted-foreground ml-1">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const { addToCart, toggleWishlist, isWishlisted, getProductReviews, addReview } = useApp();
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const productReviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      description: `Total: ₹${(product.price * quantity).toLocaleString("en-IN")}`,
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      description: product.name,
      icon: wishlisted ? "💔" : "❤️",
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    addReview({
      productId: product.id,
      author: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    toast.success("Review submitted! Thank you for your feedback.");
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
    setSubmitting(false);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md font-semibold text-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-4">
            <DialogHeader>
              <div className="flex items-start justify-between gap-2">
                <DialogTitle className="text-xl font-bold font-display text-left leading-tight flex-1">
                  {product.name}
                </DialogTitle>
                {/* Wishlist heart button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors duration-200"
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
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

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  product.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
              </span>
            </div>

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
                  disabled={!product.inStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock
                ? `Add to Cart — ₹${(product.price * quantity).toLocaleString("en-IN")}`
                : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 border-t border-border">
          <h3 className="font-semibold font-display text-lg mb-4">
            Customer Reviews
            {productReviews.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({productReviews.length})
              </span>
            )}
          </h3>

          {productReviews.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-4xl mb-2">⭐</div>
              <p className="font-medium">No reviews yet.</p>
              <p className="text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {productReviews.map((review) => (
                <div key={review.id} className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground shrink-0">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold">{review.author}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Submission Form */}
          <Separator className="mb-5" />
          <h4 className="font-medium font-display mb-4 text-foreground">Write a Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="review-name">Your Name</Label>
              <Input
                id="review-name"
                placeholder="Enter your name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Your Rating</Label>
              <InteractiveStarRating value={reviewRating} onChange={setReviewRating} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Share your experience with this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
