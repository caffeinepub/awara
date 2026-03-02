import { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "../context/AppContext";
import type { Product, Category } from "../types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

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

function ComplaintBox() {
  const { submitComplaint, getPublicComplaints } = useApp();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const publicComplaints = getPublicComplaints();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!message.trim()) { toast.error("Please enter your complaint"); return; }
    submitComplaint(name.trim(), message.trim());
    toast.success("Complaint submitted. Admin will respond soon.");
    setName("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="max-w-2xl mx-auto px-4 pb-12">
      <div className="bg-card border border-border rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold font-display text-lg">Have a Complaint? We're Listening.</h2>
            <p className="text-muted-foreground text-sm">Your feedback helps us improve. Replies are posted publicly.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="cmp-name" className="text-sm">Your Name *</Label>
            <Input
              id="cmp-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cmp-msg" className="text-sm">Your Complaint *</Label>
            <Textarea
              id="cmp-msg"
              placeholder="Describe your issue or complaint..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
          <Button
            type="submit"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={submitted}
          >
            <Send className="h-4 w-4" />
            {submitted ? "Submitted!" : "Submit Complaint"}
          </Button>
        </form>

        {/* Public replies */}
        {publicComplaints.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Public Responses
            </h3>
            {publicComplaints.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{c.customerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{c.message}</p>
                </div>
                {c.reply && (
                  <div className="ml-4 bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <p className="text-xs text-primary font-semibold mb-1">AWARA Team replied:</p>
                    <p className="text-sm">{c.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {publicComplaints.length === 0 && (
          <div className="mt-5 text-center text-sm text-muted-foreground py-3">
            No public responses yet.
          </div>
        )}
      </div>
    </section>
  );
}

export function HomePage() {
  const { products, freeDeliveryThreshold, getActiveOccasion } = useApp();
  const activeOccasion = getActiveOccasion();
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
        {activeOccasion ? (
          <div
            className="relative text-white py-10 px-4 min-h-[160px] flex items-center"
            style={{
              backgroundImage: `url(${activeOccasion.bannerImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
              <h1 className="text-3xl sm:text-5xl font-bold font-display mb-2 drop-shadow-lg">
                {activeOccasion.title}
              </h1>
              <p className="text-white/90 text-lg sm:text-xl drop-shadow">
                {activeOccasion.text}
              </p>
            </div>
          </div>
        ) : (
          <div className="awara-gradient text-white py-10 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">
                Shop Everything You Need
              </h1>
              <p className="text-white/80 text-lg">
                Quality products at unbeatable prices. Free delivery above ₹{freeDeliveryThreshold}!
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
        )}

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

      {/* Complaint Box */}
      <ComplaintBox />

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
