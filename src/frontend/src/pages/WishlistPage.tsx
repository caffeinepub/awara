import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "../components/StarRating";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { useApp } from "../context/AppContext";
import type { Product } from "../types";
import { toast } from "sonner";

export function WishlistPage() {
  const { products, wishlistIds, toggleWishlist, addToCart } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleRemove = (product: Product) => {
    toggleWishlist(product.id);
    toast("Removed from wishlist", {
      description: product.name,
      icon: "💔",
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: `₹${product.price.toLocaleString("en-IN")}`,
    });
  };

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            <h1 className="text-2xl font-bold font-display text-foreground">
              My Wishlist
            </h1>
            {wishlistProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <Heart className="h-20 w-20 text-muted-foreground/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">💔</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold font-display mb-2 text-foreground">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <ShoppingCart className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Bulk action */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-xl overflow-hidden shadow-card flex flex-col group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                >
                  {/* Image */}
                  <button
                    type="button"
                    className="relative overflow-hidden bg-muted aspect-square cursor-pointer w-full block"
                    onClick={() => handleViewDetail(product)}
                    aria-label={`View details for ${product.name}`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Remove from wishlist button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-md transition-all duration-200 hover:scale-110 z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </button>

                    <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
                      {product.category}
                    </Badge>

                    {!product.inStock && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center">
                        <span className="text-white text-xs font-medium">Out of Stock</span>
                      </div>
                    )}
                  </button>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <button
                      type="button"
                      className="font-semibold text-sm font-display text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-left w-full"
                      onClick={() => handleViewDetail(product)}
                    >
                      {product.name}
                    </button>

                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                    <div className="text-lg font-bold text-foreground font-display mt-auto pt-1">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="flex gap-1.5 mt-1">
                      <Button
                        size="sm"
                        className="flex-1 gap-1 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 shrink-0 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400"
                        onClick={() => handleRemove(product)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Toaster />
    </div>
  );
}
