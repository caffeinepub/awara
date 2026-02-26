import { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { Badge } from "@/components/ui/badge";
import { useApp } from "../context/AppContext";
import type { Product, Category } from "../types";
import { Toaster } from "@/components/ui/sonner";

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🛍️",
  Household: "🏠",
  Clothes: "👗",
  Bedsheet: "🛏️",
  Stickers: "🌟",
  Toys: "🧸",
  "Mobile Covers": "📱",
  Other: "✨",
};

type FilterCategory = "All" | Category;
const FILTER_CATEGORIES: FilterCategory[] = [
  "All",
  "Household",
  "Clothes",
  "Bedsheet",
  "Stickers",
  "Toys",
  "Mobile Covers",
  "Other",
];

export function HomePage() {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="awara-gradient text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">
              Shop Everything You Need
            </h1>
            <p className="text-white/80 text-lg">
              Quality products at unbeatable prices. Free delivery above ₹499!
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                🚚 Fast Delivery
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                ✅ Quality Assured
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                💰 Best Prices
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-chip shrink-0 border-2 transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                {cat}
                {cat !== "All" && (
                  <Badge
                    variant="secondary"
                    className={`ml-1 text-xs px-1.5 h-4 ${
                      selectedCategory === cat
                        ? "bg-white/30 text-white"
                        : "bg-muted"
                    }`}
                  >
                    {products.filter((p) => p.category === cat).length}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display text-foreground">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({filteredProducts.length} items)
              </span>
            </h2>
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                Results for "{searchQuery}"
              </span>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold font-display mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}
        </div>
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
