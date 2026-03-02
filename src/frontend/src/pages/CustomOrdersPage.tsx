import { useState, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  Paintbrush,
  Upload,
  ImageIcon,
  ShoppingCart,
  PackageSearch,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { CustomOrderRequest } from "../types";

const STATUS_CONFIG: Record<
  CustomOrderRequest["status"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="h-3 w-3" />,
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

interface CustomOrderFormState {
  description: string;
  quantity: string;
  dimensions: string;
  budget: string;
  imageUrl: string;
  imagePreview: string;
}

const EMPTY_FORM: CustomOrderFormState = {
  description: "",
  quantity: "1",
  dimensions: "",
  budget: "",
  imageUrl: "",
  imagePreview: "",
};

export function CustomOrdersPage() {
  const { submitCustomOrder, getMyCustomOrders, addToCart } = useApp();
  const [form, setForm] = useState<CustomOrderFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myOrders = getMyCustomOrders();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm((f) => ({ ...f, imageUrl: result, imagePreview: result }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm((f) => ({ ...f, imageUrl: "", imagePreview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) {
      toast.error("Please describe your custom order");
      return;
    }
    const qty = parseInt(form.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }
    setSubmitting(true);
    submitCustomOrder({
      imageUrl: form.imageUrl,
      description: form.description.trim(),
      quantity: qty,
      dimensions: form.dimensions.trim(),
      budget: form.budget.trim(),
    });
    toast.success("Custom order submitted!", {
      description: "We'll review your request and get back to you.",
    });
    setForm(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSubmitting(false);
  };

  const handleAddAcceptedToCart = (order: CustomOrderRequest) => {
    if (!order.quotedPrice) return;
    addToCart({
      id: `custom_${order.id}`,
      name: `Custom Order: ${order.description.slice(0, 40)}${order.description.length > 40 ? "..." : ""}`,
      price: order.quotedPrice,
      category: "Other",
      description: order.description,
      imageUrl: order.imageUrl || "https://picsum.photos/300/300?random=custom",
      rating: 0,
      reviewCount: 0,
      inStock: true,
    });
    toast.success("Custom order added to cart!", {
      description: `₹${order.quotedPrice.toLocaleString("en-IN")}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Paintbrush className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">Custom Orders</h1>
            <p className="text-sm text-muted-foreground">
              Upload your design or describe what you need — we&apos;ll make it happen
            </p>
          </div>
        </div>

        {/* Submit Form */}
        <section className="bg-card border border-border rounded-2xl p-6 mb-10 shadow-card">
          <h2 className="font-semibold font-display text-lg mb-5">
            Request a Custom Order
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Reference Image (optional)
              </Label>
              <button
                type="button"
                className="w-full relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors text-left bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.imagePreview ? (
                  <div className="relative">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full max-h-52 object-contain bg-muted"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-medium">
                      <Upload className="h-3.5 w-3.5" />
                      Choose File
                    </div>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                aria-label="Upload reference image"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="co-desc">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="co-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe what you want (e.g. Custom printed t-shirt with my logo, white background...)"
                rows={4}
                className="mt-1 resize-none"
              />
            </div>

            {/* Row: Quantity + Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="co-qty">Quantity</Label>
                <Input
                  id="co-qty"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="co-dims">Size / Dimensions</Label>
                <Input
                  id="co-dims"
                  value={form.dimensions}
                  onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
                  placeholder="e.g. L, 30x40cm"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <Label htmlFor="co-budget">Budget / Price Range</Label>
              <Input
                id="co-budget"
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                placeholder="e.g. ₹200–₹500"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            >
              <Paintbrush className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Custom Order Request"}
            </Button>
          </form>
        </section>

        {/* My Orders */}
        <section>
          <h2 className="font-semibold font-display text-lg mb-4">
            My Custom Order Requests
          </h2>

          {myOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <PackageSearch className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No custom orders yet</p>
              <p className="text-sm mt-1">
                Submit a request above and we&apos;ll review it
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start shadow-card"
                  >
                    {/* Image thumbnail */}
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
                      {order.imageUrl ? (
                        <img
                          src={order.imageUrl}
                          alt="Custom order"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Paintbrush className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.className}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <p className="text-sm font-medium line-clamp-2 text-foreground">
                        {order.description}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
                        <span>Qty: {order.quantity}</span>
                        {order.dimensions && <span>Size: {order.dimensions}</span>}
                        {order.budget && <span>Budget: {order.budget}</span>}
                      </div>

                      {order.status === "accepted" && order.quotedPrice !== undefined && (
                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-semibold text-green-700">
                            Quoted: ₹{order.quotedPrice.toLocaleString("en-IN")}
                          </span>
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleAddAcceptedToCart(order)}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Add to Cart
                          </Button>
                        </div>
                      )}

                      {order.status === "rejected" && (
                        <p className="text-xs text-red-500 mt-1">
                          This request was not accepted. Feel free to submit a new one.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
