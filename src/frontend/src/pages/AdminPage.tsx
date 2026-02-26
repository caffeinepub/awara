import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  ShieldCheck,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Package,
  Tag,
  ShoppingBag,
  Lock,
  ArrowLeft,
  Check,
  X,
  Home,
  Percent,
  Calendar,
  Palette,
  HeadphonesIcon,
  Mail,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { Product, Category, Discount, Occasion } from "../types";
import { ALL_CATEGORIES } from "../types";

// Admin Login Screen
function AdminLogin() {
  const { adminLogin } = useApp();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passkey);
    if (!success) {
      setError(true);
      toast.error("Invalid passkey. Try again.");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-card rounded-2xl shadow-card-hover p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter passkey to access admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="passkey">Admin Passkey</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passkey"
                  type="password"
                  placeholder="Enter passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className={`pl-9 ${error ? "border-destructive" : ""}`}
                />
              </div>
              {error && (
                <p className="text-xs text-destructive mt-1">
                  Invalid passkey. Please try again.
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Default: awara123
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login to Admin
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Form
interface ProductFormData {
  name: string;
  price: string;
  category: Category;
  description: string;
  imageUrl: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  price: "",
  category: "Household",
  description: "",
  imageUrl: "",
};

function ProductFormDialog({
  open,
  onClose,
  editProduct,
}: {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
}) {
  const { addProduct, updateProduct } = useApp();
  const [form, setForm] = useState<ProductFormData>(
    editProduct
      ? {
          name: editProduct.name,
          price: String(editProduct.price),
          category: editProduct.category,
          description: editProduct.description,
          imageUrl: editProduct.imageUrl,
        }
      : EMPTY_FORM
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const productData = {
      name: form.name.trim(),
      price,
      category: form.category,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() || `https://picsum.photos/300/300?random=${Date.now()}`,
      rating: editProduct?.rating ?? 4.0,
      reviewCount: editProduct?.reviewCount ?? 0,
      inStock: true,
    };

    if (editProduct) {
      updateProduct(editProduct.id, productData);
      toast.success("Product updated successfully");
    } else {
      addProduct(productData);
      toast.success("Product added successfully");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="p-name">Product Name *</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Steel Pressure Cooker"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="p-price">Price (₹) *</Label>
              <Input
                id="p-price"
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 499"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="p-category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v as Category }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="p-desc">Description *</Label>
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe the product..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="p-image">Image URL</Label>
            <Input
              id="p-image"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://... (leave blank for placeholder)"
              className="mt-1"
            />
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Products Tab
function ProductsTab() {
  const { products, deleteProduct } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Delete "${product.name}"?`)) {
      deleteProduct(product.id);
      toast.success("Product deleted");
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={handleAdd}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0"
                      />
                      <span className="font-medium text-sm line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{product.price.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ⭐ {product.rating}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditProduct(null);
        }}
        editProduct={editProduct}
      />
    </div>
  );
}

// Categories Tab
function CategoriesTab() {
  const { categories, updateCategoryImage } = useApp();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSaveImage = (categoryName: string) => {
    updateCategoryImage(categoryName as Category, imageUrl.trim());
    setEditingCategory(null);
    setImageUrl("");
    toast.success("Category image updated");
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-card border border-border rounded-xl p-4 text-center shadow-card"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">{cat.emoji}</span>
              )}
            </div>
            <p className="font-medium text-sm font-display mb-2">{cat.name}</p>

            {editingCategory === cat.name ? (
              <div className="space-y-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL"
                  className="text-xs h-7"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-6 text-xs flex-1 bg-primary text-primary-foreground"
                    onClick={() => handleSaveImage(cat.name)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs flex-1"
                    onClick={() => setEditingCategory(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs w-full"
                onClick={() => {
                  setEditingCategory(cat.name);
                  setImageUrl(cat.imageUrl ?? "");
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Set Image
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Discounts Tab
function DiscountsTab() {
  const { products, discounts, addDiscount, removeDiscount } = useApp();
  const [productId, setProductId] = useState<string>("all");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const now = new Date().toISOString();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numVal = parseFloat(value);
    if (!numVal || numVal <= 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    if (discountType === "percent" && numVal > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }
    if (!expiresAt) {
      toast.error("Please set an expiry date");
      return;
    }
    addDiscount({
      productId,
      type: discountType,
      value: numVal,
      expiresAt: new Date(expiresAt).toISOString(),
    });
    toast.success("Discount added successfully");
    setValue("");
    setExpiresAt("");
  };

  const productName = (id: string) => {
    if (id === "all") return "All Products";
    return products.find((p) => p.id === id)?.name ?? id;
  };

  return (
    <div className="space-y-6">
      {/* Add Discount Form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold font-display mb-4">Add New Discount</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="disc-product">Apply To</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="mt-1" id="disc-product">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="disc-type">Discount Type</Label>
            <Select
              value={discountType}
              onValueChange={(v) => setDiscountType(v as "percent" | "fixed")}
            >
              <SelectTrigger className="mt-1" id="disc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="disc-value">
              Value ({discountType === "percent" ? "%" : "₹"})
            </Label>
            <Input
              id="disc-value"
              type="number"
              min="1"
              max={discountType === "percent" ? "100" : undefined}
              placeholder={discountType === "percent" ? "e.g. 20" : "e.g. 50"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="disc-expires">Expiry Date</Label>
            <Input
              id="disc-expires"
              type="date"
              min={todayStr}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Discount
            </Button>
          </div>
        </form>
      </div>

      {/* Discounts Table */}
      {discounts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Percent className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No discounts created yet</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((d: Discount) => {
                const expired = d.expiresAt <= now;
                return (
                  <TableRow
                    key={d.id}
                    className={expired ? "opacity-50" : "hover:bg-muted/40"}
                  >
                    <TableCell
                      className={`text-sm font-medium ${expired ? "line-through text-muted-foreground" : ""}`}
                    >
                      {productName(d.productId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {d.type === "percent" ? "%" : "₹"} Off
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {d.type === "percent"
                        ? `${d.value}%`
                        : `₹${d.value.toLocaleString("en-IN")}`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {expired ? (
                        <span className="text-destructive text-xs font-medium">
                          Expired {new Date(d.expiresAt).toLocaleDateString("en-IN")}
                        </span>
                      ) : (
                        new Date(d.expiresAt).toLocaleDateString("en-IN")
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => {
                          removeDiscount(d.id);
                          toast.info("Discount removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Occasions Tab
interface OccasionFormData {
  title: string;
  text: string;
  bannerImageUrl: string;
  startDate: string;
  endDate: string;
}

const EMPTY_OCCASION_FORM: OccasionFormData = {
  title: "",
  text: "",
  bannerImageUrl: "",
  startDate: "",
  endDate: "",
};

function OccasionsTab() {
  const { occasions, addOccasion, updateOccasion, deleteOccasion } = useApp();
  const [form, setForm] = useState<OccasionFormData>(EMPTY_OCCASION_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const resetForm = () => {
    setForm(EMPTY_OCCASION_FORM);
    setEditingId(null);
    setFormError("");
  };

  const handleEdit = (occasion: Occasion) => {
    setForm({
      title: occasion.title,
      text: occasion.text,
      bannerImageUrl: occasion.bannerImageUrl,
      startDate: occasion.startDate,
      endDate: occasion.endDate,
    });
    setEditingId(occasion.id);
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) { setFormError("Title is required"); return; }
    if (!form.bannerImageUrl.trim()) { setFormError("Banner image URL is required"); return; }
    if (!form.startDate) { setFormError("Start date is required"); return; }
    if (!form.endDate) { setFormError("End date is required"); return; }
    if (form.endDate < form.startDate) { setFormError("End date must be on or after start date"); return; }

    const data: Omit<Occasion, "id"> = {
      title: form.title.trim(),
      text: form.text.trim(),
      bannerImageUrl: form.bannerImageUrl.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    if (editingId) {
      updateOccasion(editingId, data);
      toast.success("Occasion updated");
    } else {
      addOccasion(data);
      toast.success("Occasion added");
    }
    resetForm();
  };

  const handleDelete = (occasion: Occasion) => {
    if (confirm(`Delete occasion "${occasion.title}"?`)) {
      deleteOccasion(occasion.id);
      toast.info("Occasion deleted");
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold font-display mb-4">
          {editingId ? "Edit Occasion" : "Add New Occasion"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occ-title">Title *</Label>
              <Input
                id="occ-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Happy Diwali!"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="occ-text">Tagline / Text</Label>
              <Input
                id="occ-text"
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="e.g. Celebrate with amazing offers"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="occ-banner">Banner Image URL *</Label>
            <Input
              id="occ-banner"
              value={form.bannerImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, bannerImageUrl: e.target.value }))}
              placeholder="https://..."
              className="mt-1"
            />
            {form.bannerImageUrl && (
              <img
                src={form.bannerImageUrl}
                alt="Banner preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-border"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occ-start">Start Date *</Label>
              <Input
                id="occ-start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="occ-end">End Date *</Label>
              <Input
                id="occ-end"
                type="date"
                min={form.startDate || todayStr}
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editingId ? (
                <><Check className="h-4 w-4" /> Update Occasion</>
              ) : (
                <><Plus className="h-4 w-4" /> Add Occasion</>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Occasions List */}
      {occasions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No occasions created yet</p>
          <p className="text-xs mt-1">Add occasions above to display themed banners on your store</p>
        </div>
      ) : (
        <div className="space-y-3">
          {occasions.map((occasion) => {
            const isActive = todayDate >= occasion.startDate && todayDate <= occasion.endDate;
            const isPast = todayDate > occasion.endDate;
            return (
              <div
                key={occasion.id}
                className={`bg-card border rounded-xl p-4 flex gap-4 items-start ${
                  isActive ? "border-primary" : "border-border"
                } ${isPast ? "opacity-60" : ""}`}
              >
                {occasion.bannerImageUrl && (
                  <img
                    src={occasion.bannerImageUrl}
                    alt={occasion.title}
                    className="w-20 h-14 object-cover rounded-lg shrink-0 border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold font-display text-sm">{occasion.title}</p>
                    {isActive && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Active Now
                      </span>
                    )}
                    {isPast && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        Past
                      </span>
                    )}
                  </div>
                  {occasion.text && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{occasion.text}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {occasion.startDate} → {occasion.endDate}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-primary"
                    onClick={() => handleEdit(occasion)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => handleDelete(occasion)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Orders Tab
function OrdersTab() {
  const { orders, updateOrderStatus, upiId, setUpiId, upiQrImageUrl, setUpiQrImageUrl, codEnabled, setCodEnabled, freeDeliveryThreshold, setFreeDeliveryThreshold } = useApp();
  const [editingUpi, setEditingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState(upiId);
  const [editingThreshold, setEditingThreshold] = useState(false);
  const [newThreshold, setNewThreshold] = useState(String(freeDeliveryThreshold));
  const [editingQr, setEditingQr] = useState(false);
  const [newQrUrl, setNewQrUrl] = useState(upiQrImageUrl);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* UPI Settings */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold font-display">UPI Payment Settings</h3>

        {/* UPI ID */}
        <div>
          <Label className="text-sm font-medium mb-2 block">UPI ID</Label>
          {editingUpi ? (
            <div className="flex gap-2">
              <Input
                value={newUpi}
                onChange={(e) => setNewUpi(e.target.value)}
                placeholder="yourname@upi"
                className="max-w-xs"
              />
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setUpiId(newUpi);
                  setEditingUpi(false);
                  toast.success("UPI ID updated");
                }}
              >
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingUpi(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-muted px-3 py-1.5 rounded-lg">
                {upiId}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewUpi(upiId);
                  setEditingUpi(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* UPI QR Code Image */}
        <div>
          <Label className="text-sm font-medium mb-1 block">UPI QR Code Image</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Paste a URL to your UPI QR code image. This will replace the generated QR at checkout.
          </p>
          {editingQr ? (
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Input
                  value={newQrUrl}
                  onChange={(e) => setNewQrUrl(e.target.value)}
                  placeholder="https://... (QR image URL)"
                  className="max-w-sm"
                />
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setUpiQrImageUrl(newQrUrl.trim());
                    setEditingQr(false);
                    toast.success("UPI QR image updated");
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewQrUrl(upiQrImageUrl);
                    setEditingQr(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              {newQrUrl && (
                <img
                  src={newQrUrl}
                  alt="QR Preview"
                  className="w-[60px] h-[60px] object-contain rounded border border-border"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {upiQrImageUrl ? (
                <img
                  src={upiQrImageUrl}
                  alt="UPI QR"
                  className="w-[60px] h-[60px] object-contain rounded border border-border"
                />
              ) : (
                <span className="text-sm text-muted-foreground italic">No QR image set</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewQrUrl(upiQrImageUrl);
                  setEditingQr(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                {upiQrImageUrl ? "Edit" : "Set QR Image"}
              </Button>
              {upiQrImageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => {
                    setUpiQrImageUrl("");
                    setNewQrUrl("");
                    toast.info("QR image cleared");
                  }}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Store Settings */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-5">
        <h3 className="font-semibold font-display">Store Settings</h3>

        {/* Free Delivery Threshold */}
        <div>
          <Label className="text-sm font-medium">Free Delivery Threshold (₹)</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Orders above this amount qualify for free delivery
          </p>
          {editingThreshold ? (
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                placeholder="e.g. 399"
                className="max-w-xs"
              />
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  const val = parseInt(newThreshold, 10);
                  if (isNaN(val) || val < 0) {
                    toast.error("Please enter a valid amount");
                    return;
                  }
                  setFreeDeliveryThreshold(val);
                  setEditingThreshold(false);
                  toast.success("Free delivery threshold updated");
                }}
              >
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingThreshold(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-muted px-3 py-1.5 rounded-lg">
                ₹{freeDeliveryThreshold}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewThreshold(String(freeDeliveryThreshold));
                  setEditingThreshold(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* COD Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Cash on Delivery (COD)</Label>
            <p className="text-xs text-muted-foreground">
              {codEnabled ? "Currently enabled at checkout" : "Currently hidden from checkout"}
            </p>
          </div>
          <Switch
            checked={codEnabled}
            onCheckedChange={(checked) => {
              setCodEnabled(checked);
              toast.success(checked ? "COD enabled" : "COD disabled");
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{order.total.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status] ?? ""}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "pending" && (
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            updateOrderStatus(order.id, "approved");
                            toast.success("Order approved");
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => {
                            updateOrderStatus(order.id, "denied");
                            toast.info("Order denied");
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Deny
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Themes Tab
// ─────────────────────────────────────────────────────────────────────────────

interface ThemeDefinition {
  key: string;
  label: string;
  bg: string;       // hex for swatch display only
  primary: string;
  accent: string;
  description: string;
}

const THEMES: ThemeDefinition[] = [
  {
    key: "tokyo",
    label: "Tokyo",
    bg: "#0d0d0d",
    primary: "#ff2d78",
    accent: "#00e5ff",
    description: "Dark neon — cyberpunk urban vibes",
  },
  {
    key: "minimal-white",
    label: "Minimal White",
    bg: "#ffffff",
    primary: "#111111",
    accent: "#555555",
    description: "Clean, light, modern editorial",
  },
  {
    key: "diwali",
    label: "Diwali",
    bg: "#1a0a00",
    primary: "#ff9500",
    accent: "#ffd700",
    description: "Warm golds & oranges — festive Indian feel",
  },
  {
    key: "monsoon",
    label: "Monsoon",
    bg: "#0a1628",
    primary: "#4da6ff",
    accent: "#00e5b0",
    description: "Cool blues & teals — fresh and calm",
  },
  {
    key: "midnight",
    label: "Midnight",
    bg: "#0a0a1a",
    primary: "#8b5cf6",
    accent: "#c4b5fd",
    description: "Deep navy purple — premium luxury",
  },
  {
    key: "sakura",
    label: "Sakura",
    bg: "#fff5f7",
    primary: "#e91e8c",
    accent: "#ffb3c6",
    description: "Soft pinks — cherry blossom inspired",
  },
  {
    key: "desert-sand",
    label: "Desert Sand",
    bg: "#f5e6d3",
    primary: "#c17f24",
    accent: "#d4a96a",
    description: "Warm beige & terracotta — earthy organic",
  },
  {
    key: "ocean",
    label: "Ocean",
    bg: "#001a2c",
    primary: "#00b4d8",
    accent: "#48cae4",
    description: "Deep teal & aqua — serene and bold",
  },
  {
    key: "neon-mumbai",
    label: "Neon Mumbai",
    bg: "#0f0f0f",
    primary: "#ff4500",
    accent: "#ffcc00",
    description: "Vibrant high-contrast — Indian street energy",
  },
];

function ThemesTab() {
  const { activeTheme, setActiveTheme } = useApp();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a theme to apply it to the entire store instantly.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.key;
          return (
            <button
              key={theme.key}
              type="button"
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover text-left w-full ${
                isActive
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
              onClick={() => {
                setActiveTheme(theme.key);
                toast.success(`"${theme.label}" theme applied`);
              }}
            >
              {/* Color swatches */}
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg border border-black/10 shadow-xs shrink-0"
                  style={{ background: theme.bg }}
                  title="Background"
                />
                <div
                  className="w-8 h-8 rounded-lg border border-black/10 shadow-xs shrink-0"
                  style={{ background: theme.primary }}
                  title="Primary"
                />
                <div
                  className="w-8 h-8 rounded-lg border border-black/10 shadow-xs shrink-0"
                  style={{ background: theme.accent }}
                  title="Accent"
                />
                <div className="flex-1" />
                {isActive && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <Check className="h-3 w-3" />
                    Active
                  </span>
                )}
              </div>

              {/* Name + description */}
              <p className="font-semibold text-sm font-display">{theme.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {theme.description}
              </p>

              {/* Activate button */}
              {!isActive && (
                <div className="mt-3">
                  <span className="inline-block text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground w-full text-center">
                    Click to apply
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Support Tab
// ─────────────────────────────────────────────────────────────────────────────

function SupportTab() {
  const { supportEmail, setSupportEmail } = useApp();
  const [emailInput, setEmailInput] = useState(supportEmail);
  const [editing, setEditing] = useState(!supportEmail);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportEmail(emailInput.trim());
    setEditing(false);
    toast.success("Support email updated");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold font-display">Support Email Address</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This email will be displayed on the public Support page so customers
          can reach you for help.
        </p>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <Label htmlFor="support-email">Email Address</Label>
              <Input
                id="support-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="support@awara.in"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4" />
                Save Email
              </Button>
              {supportEmail && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEmailInput(supportEmail);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`mailto:${supportEmail}`}
              className="font-mono text-sm bg-muted px-3 py-1.5 rounded-lg text-primary hover:underline"
            >
              {supportEmail}
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEmailInput(supportEmail);
                setEditing(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {supportEmail && (
        <p className="text-xs text-muted-foreground">
          Customers can visit{" "}
          <span className="font-mono bg-muted px-1 rounded">/support</span> to
          find this email and contact you.
        </p>
      )}
    </div>
  );
}

// Main Admin Dashboard
function AdminDashboard() {
  const { adminLogout, products, orders } = useApp();

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-foreground text-primary-foreground px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold font-display text-lg">AWARA Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary-foreground hover:bg-white/10">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">View Store</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary-foreground hover:bg-white/10"
              onClick={adminLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold font-display">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold font-display">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <Tag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold font-display">
                  {pendingOrders}
                  {pendingOrders > 0 && (
                    <span className="text-sm text-amber-600 ml-1">⚠</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
              <Badge variant="secondary" className="ml-1 text-xs">
                {products.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
              {pendingOrders > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-xs">
                  {pendingOrders}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-2">
              <Percent className="h-4 w-4" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="occasions" className="gap-2">
              <Calendar className="h-4 w-4" />
              Occasions
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <HeadphonesIcon className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="discounts">
            <DiscountsTab />
          </TabsContent>
          <TabsContent value="occasions">
            <OccasionsTab />
          </TabsContent>
          <TabsContent value="themes">
            <ThemesTab />
          </TabsContent>
          <TabsContent value="support">
            <SupportTab />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

// Main export - shows login or dashboard based on auth state
export function AdminPage() {
  const { isAdminLoggedIn } = useApp();

  if (!isAdminLoggedIn) {
    return (
      <>
        <AdminLogin />
        <Toaster />
      </>
    );
  }

  return <AdminDashboard />;
}
