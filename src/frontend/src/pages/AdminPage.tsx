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
import { Separator } from "@/components/ui/separator";
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
  Paintbrush,
  Wrench,
  AlertTriangle,
  ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Shirt,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { Product, Category, Discount, Occasion, CustomOrderRequest, ClothingConfig, ClothingOrder, Complaint } from "../types";
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
  const { products, deleteProduct, updateProduct } = useApp();
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
              <TableHead title="Toggle product availability">In Stock</TableHead>
              <TableHead title="Show COD Available badge on product card">COD Badge</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-muted"
                        />
                        {!product.inStock && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-4">
                            OOS
                          </span>
                        )}
                      </div>
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
                  <TableCell>
                    <Switch
                      checked={product.inStock !== false}
                      onCheckedChange={(checked) => {
                        updateProduct(product.id, { inStock: checked });
                        toast.success(
                          checked
                            ? `"${product.name}" is now in stock`
                            : `"${product.name}" marked as out of stock`
                        );
                      }}
                      aria-label="Toggle in stock"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!!product.codOverride}
                      onCheckedChange={(checked) => {
                        updateProduct(product.id, { codOverride: checked });
                        toast.success(
                          checked
                            ? `COD badge enabled for "${product.name}"`
                            : `COD badge removed from "${product.name}"`
                        );
                      }}
                      aria-label="Toggle COD badge"
                    />
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

// Orders Tab - expandable order details, cancellation management
function OrderDetailsRow({ order }: { order: import("../types").Order }) {
  const { updateCancellationStatus } = useApp();
  const [expanded, setExpanded] = useState(false);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <TableRow className="hover:bg-muted/40">
        <TableCell className="font-mono text-xs">{order.id.slice(0, 12)}…</TableCell>
        <TableCell>
          <div>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-xs text-muted-foreground">{order.contact || "—"}</p>
          </div>
        </TableCell>
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
          <div className="flex flex-col gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${statusColor[order.status] ?? ""}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.cancellationRequested && order.cancellationStatus === "pending" && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 w-fit">
                Cancel Req.
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-1 justify-end">
            {order.cancellationRequested && order.cancellationStatus === "pending" && (
              <>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    updateCancellationStatus(order.id, "approved");
                    toast.success("Cancellation approved");
                  }}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve Cancel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    updateCancellationStatus(order.id, "denied");
                    toast.info("Cancellation denied");
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Deny
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/20 px-4 py-3">
            <div className="space-y-3">
              {/* Customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p>
                  <p className="font-medium">{order.contact || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Delivery Address</p>
                  <p className="font-medium">{order.deliveryAddress || "—"}</p>
                </div>
              </div>
              <Separator />
              {/* Products */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-9 h-9 rounded-lg object-cover bg-muted border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-sm font-medium shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-right text-sm font-bold">
                Total: ₹{order.total.toLocaleString("en-IN")}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function OrdersTab() {
  const { orders, upiId, setUpiId, upiQrImageUrl, setUpiQrImageUrl, codEnabled, setCodEnabled, freeDeliveryThreshold, setFreeDeliveryThreshold } = useApp();
  const [editingUpi, setEditingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState(upiId);
  const [editingThreshold, setEditingThreshold] = useState(false);
  const [newThreshold, setNewThreshold] = useState(String(freeDeliveryThreshold));
  const [editingQr, setEditingQr] = useState(false);
  const [newQrUrl, setNewQrUrl] = useState(upiQrImageUrl);

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
                <OrderDetailsRow key={order.id} order={order} />
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

// ─────────────────────────────────────────────────────────────────────────────
// Custom Orders Admin Tab
// ─────────────────────────────────────────────────────────────────────────────

const CO_STATUS_CONFIG: Record<
  CustomOrderRequest["status"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-3 w-3" />,
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function CustomOrdersAdminTab() {
  const { customOrders, updateCustomOrderStatus } = useApp();
  const [quotePrices, setQuotePrices] = useState<Record<string, string>>({});
  const [accepting, setAccepting] = useState<string | null>(null);

  const handleAccept = (orderId: string) => {
    const priceStr = quotePrices[orderId];
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      toast.error("Enter a valid quoted price");
      return;
    }
    updateCustomOrderStatus(orderId, "accepted", price);
    setAccepting(null);
    setQuotePrices((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    toast.success("Custom order accepted");
  };

  const handleReject = (orderId: string) => {
    if (!confirm("Reject this custom order?")) return;
    updateCustomOrderStatus(orderId, "rejected");
    toast.info("Custom order rejected");
  };

  return (
    <div className="space-y-4">
      {customOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Paintbrush className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No custom order requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customOrders.map((order) => {
            const cfg = CO_STATUS_CONFIG[order.status];
            const isAccepting = accepting === order.id;
            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start"
              >
                {/* Image */}
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
                  {order.imageUrl ? (
                    <img
                      src={order.imageUrl}
                      alt="Custom order"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {order.id.slice(0, 12)}…
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {order.description}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                    <span>Qty: {order.quantity}</span>
                    {order.dimensions && <span>Size: {order.dimensions}</span>}
                    {order.budget && <span>Budget: {order.budget}</span>}
                  </div>

                  {order.status === "accepted" && order.quotedPrice !== undefined && (
                    <p className="text-xs text-green-700 font-semibold mt-1">
                      Quoted Price: ₹{order.quotedPrice.toLocaleString("en-IN")}
                    </p>
                  )}

                  {/* Actions for pending orders */}
                  {order.status === "pending" && (
                    <div className="mt-2">
                      {isAccepting ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Quoted price (₹)"
                            value={quotePrices[order.id] ?? ""}
                            onChange={(e) =>
                              setQuotePrices((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            className="h-8 text-xs max-w-[140px]"
                          />
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                            onClick={() => handleAccept(order.id)}
                          >
                            <Check className="h-3 w-3" />
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setAccepting(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                            onClick={() => setAccepting(order.id)}
                          >
                            <Check className="h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-1"
                            onClick={() => handleReject(order.id)}
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Clothes Config Admin Tab
// ─────────────────────────────────────────────────────────────────────────────

function ClothesAdminTab() {
  const { clothingConfigs, updateClothingConfig } = useApp();
  const [editingBaseCost, setEditingBaseCost] = useState<Record<string, string>>({});
  const [newColorForms, setNewColorForms] = useState<
    Record<string, { color: string; hex: string; extraPrice: string }>
  >({});

  const handleSaveBaseCost = (configId: string) => {
    const val = parseFloat(editingBaseCost[configId] ?? "");
    if (isNaN(val) || val <= 0) { toast.error("Enter a valid base cost"); return; }
    updateClothingConfig(configId, { baseCost: val });
    setEditingBaseCost((prev) => { const n = { ...prev }; delete n[configId]; return n; });
    toast.success("Base cost updated");
  };

  const handleUpdateColorPrice = (configId: string, colorIndex: number, extraPrice: number) => {
    const config = clothingConfigs.find((c) => c.id === configId);
    if (!config) return;
    const updated = config.colors.map((c, i) => i === colorIndex ? { ...c, extraPrice } : c);
    updateClothingConfig(configId, { colors: updated });
  };

  const handleRemoveColor = (configId: string, colorIndex: number) => {
    const config = clothingConfigs.find((c) => c.id === configId);
    if (!config) return;
    const updated = config.colors.filter((_, i) => i !== colorIndex);
    updateClothingConfig(configId, { colors: updated });
    toast.success("Color removed");
  };

  const handleAddColor = (configId: string) => {
    const form = newColorForms[configId];
    if (!form?.color?.trim()) { toast.error("Enter color name"); return; }
    if (!form.hex?.match(/^#[0-9a-fA-F]{6}$/)) { toast.error("Enter a valid hex color (e.g. #ff0000)"); return; }
    const extraPrice = parseFloat(form.extraPrice) || 0;
    const config = clothingConfigs.find((c) => c.id === configId);
    if (!config) return;
    updateClothingConfig(configId, {
      colors: [...config.colors, { color: form.color.trim(), hex: form.hex, extraPrice }],
    });
    setNewColorForms((prev) => { const n = { ...prev }; delete n[configId]; return n; });
    toast.success("Color added");
  };

  return (
    <div className="space-y-6">
      {clothingConfigs.map((config) => (
        <div key={config.id} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={config.imageUrl}
              alt={config.name}
              className="w-16 h-16 object-contain bg-muted rounded-lg border border-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold font-display text-base mb-2">{config.name}</h3>

              {/* Base cost */}
              <div className="flex items-center gap-2 flex-wrap">
                <Label className="text-xs text-muted-foreground">Base Cost (₹):</Label>
                {editingBaseCost[config.id] !== undefined ? (
                  <>
                    <Input
                      type="number"
                      min="1"
                      value={editingBaseCost[config.id]}
                      onChange={(e) =>
                        setEditingBaseCost((prev) => ({ ...prev, [config.id]: e.target.value }))
                      }
                      className="h-7 text-xs w-24"
                    />
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleSaveBaseCost(config.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        setEditingBaseCost((prev) => { const n = { ...prev }; delete n[config.id]; return n; })
                      }
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                      ₹{config.baseCost}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() =>
                        setEditingBaseCost((prev) => ({ ...prev, [config.id]: String(config.baseCost) }))
                      }
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Colors</p>
            {config.colors.map((color, idx) => (
              <div key={`${config.id}-${color.color}`} className="flex items-center gap-3 flex-wrap">
                <div
                  className="w-6 h-6 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium w-20 shrink-0">{color.color}</span>
                <span className="text-xs text-muted-foreground font-mono">{color.hex}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">+₹</span>
                  <Input
                    type="number"
                    min="0"
                    value={color.extraPrice}
                    onChange={(e) => handleUpdateColorPrice(config.id, idx, parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs w-16"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveColor(config.id, idx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {/* Add new color */}
            {newColorForms[config.id] !== undefined ? (
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-dashed border-border">
                <Input
                  placeholder="Color name"
                  value={newColorForms[config.id]?.color ?? ""}
                  onChange={(e) =>
                    setNewColorForms((prev) => ({ ...prev, [config.id]: { ...prev[config.id], color: e.target.value } }))
                  }
                  className="h-7 text-xs w-28"
                />
                <Input
                  placeholder="#hex"
                  value={newColorForms[config.id]?.hex ?? ""}
                  onChange={(e) =>
                    setNewColorForms((prev) => ({ ...prev, [config.id]: { ...prev[config.id], hex: e.target.value } }))
                  }
                  className="h-7 text-xs w-24"
                />
                <Input
                  placeholder="+₹ extra"
                  type="number"
                  min="0"
                  value={newColorForms[config.id]?.extraPrice ?? ""}
                  onChange={(e) =>
                    setNewColorForms((prev) => ({ ...prev, [config.id]: { ...prev[config.id], extraPrice: e.target.value } }))
                  }
                  className="h-7 text-xs w-20"
                />
                <Button
                  size="sm"
                  className="h-7 text-xs bg-primary text-primary-foreground"
                  onClick={() => handleAddColor(config.id)}
                >
                  Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    setNewColorForms((prev) => { const n = { ...prev }; delete n[config.id]; return n; })
                  }
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 mt-1"
                onClick={() =>
                  setNewColorForms((prev) => ({ ...prev, [config.id]: { color: "", hex: "#", extraPrice: "0" } }))
                }
              >
                <Plus className="h-3 w-3" />
                Add Color
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Clothing Orders Admin Tab
// ─────────────────────────────────────────────────────────────────────────────

function ClothingOrdersAdminTab() {
  const { clothingOrders, updateClothingOrderStatus } = useApp();
  const [quotePrices, setQuotePrices] = useState<Record<string, string>>({});
  const [quoting, setQuoting] = useState<string | null>(null);
  const [viewDesign, setViewDesign] = useState<{ url: string; name: string } | null>(null);

  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
    quoted: { label: "Quoted", className: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" /> },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600", icon: <XCircle className="h-3 w-3" /> },
  };

  const handleSetPrice = (orderId: string) => {
    const price = parseFloat(quotePrices[orderId] ?? "");
    if (isNaN(price) || price <= 0) { toast.error("Enter a valid price"); return; }
    updateClothingOrderStatus(orderId, "quoted", price);
    setQuoting(null);
    setQuotePrices((prev) => { const n = { ...prev }; delete n[orderId]; return n; });
    toast.success("Price quoted and customer notified");
  };

  return (
    <div className="space-y-4">
      {clothingOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Shirt className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No clothing orders yet</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Design</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quoted ₹</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clothingOrders.map((order: ClothingOrder) => {
                const cfg = statusConfig[order.status];
                return (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 10)}…</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.clothingName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: order.colorHex }}
                        />
                        <span className="text-xs">{order.colorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">₹{order.baseCost + order.colorExtraPrice}</TableCell>
                    <TableCell>
                      {order.customerDesignImageUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => setViewDesign({ url: order.customerDesignImageUrl!, name: order.clothingName })}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {order.quotedPrice !== undefined ? `₹${order.quotedPrice}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "pending" && (
                        quoting === order.id ? (
                          <div className="flex items-center gap-1 justify-end">
                            <Input
                              type="number"
                              min="1"
                              placeholder="₹"
                              value={quotePrices[order.id] ?? ""}
                              onChange={(e) =>
                                setQuotePrices((prev) => ({ ...prev, [order.id]: e.target.value }))
                              }
                              className="h-7 text-xs w-20"
                            />
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleSetPrice(order.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setQuoting(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setQuoting(order.id)}
                          >
                            Set Price
                          </Button>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Design image modal */}
      <Dialog open={!!viewDesign} onOpenChange={() => setViewDesign(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Customer Design — {viewDesign?.name}</DialogTitle>
          </DialogHeader>
          {viewDesign && (
            <img src={viewDesign.url} alt="Customer design" className="w-full rounded-lg border border-border" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Complaints Admin Tab
// ─────────────────────────────────────────────────────────────────────────────

function ComplaintsAdminTab() {
  const { complaints, replyToComplaint } = useApp();
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (id: string) => {
    const text = replyTexts[id]?.trim();
    if (!text) { toast.error("Reply cannot be empty"); return; }
    replyToComplaint(id, text);
    setReplyingTo(null);
    setReplyTexts((prev) => { const n = { ...prev }; delete n[id]; return n; });
    toast.success("Reply sent and will be shown publicly");
  };

  return (
    <div className="space-y-4">
      {complaints.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No complaints received yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint: Complaint) => (
            <div
              key={complaint.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{complaint.customerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {complaint.reply ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{complaint.message}</p>

                  {complaint.reply ? (
                    <div className="mt-3 bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground mb-1">Your reply:</p>
                      <p className="text-sm">{complaint.reply}</p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      {replyingTo === complaint.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyTexts[complaint.id] ?? ""}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({ ...prev, [complaint.id]: e.target.value }))
                            }
                            rows={3}
                            className="text-sm resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleReply(complaint.id)}
                            >
                              Send Reply (Public)
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => setReplyingTo(complaint.id)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          Reply
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Maintenance Tab
// ─────────────────────────────────────────────────────────────────────────────

function MaintenanceTab() {
  const { maintenanceMode, setMaintenanceMode, adminLogin } = useApp();
  const [passkeyDialogOpen, setPasskeyDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    active: boolean;
    message: string;
  } | null>(null);
  const [passkey, setPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState(false);
  const [messageInput, setMessageInput] = useState(maintenanceMode.message);

  const requestToggle = (active: boolean) => {
    setPendingAction({ active, message: messageInput });
    setPasskey("");
    setPasskeyError(false);
    setPasskeyDialogOpen(true);
  };

  const confirmToggle = () => {
    const valid = adminLogin(passkey);
    if (!valid) {
      setPasskeyError(true);
      return;
    }
    if (pendingAction) {
      setMaintenanceMode(pendingAction.active, pendingAction.message);
      toast.success(
        pendingAction.active
          ? "Website is now in maintenance mode"
          : "Website is now active"
      );
    }
    setPasskeyDialogOpen(false);
    setPendingAction(null);
    setPasskey("");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-primary" />
          <h3 className="font-semibold font-display">Website Status</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl mb-4">
          <div>
            <p className="font-medium text-sm">
              {maintenanceMode.active ? (
                <span className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Maintenance Mode Active
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Store is Live
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {maintenanceMode.active
                ? "Visitors see the maintenance page. Admin panel is always accessible."
                : "Customers can browse and shop normally."}
            </p>
          </div>
          <Button
            variant={maintenanceMode.active ? "default" : "outline"}
            size="sm"
            className={
              maintenanceMode.active
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "border-amber-500 text-amber-600 hover:bg-amber-50"
            }
            onClick={() => requestToggle(!maintenanceMode.active)}
          >
            {maintenanceMode.active ? "Go Live" : "Enable Maintenance"}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maint-msg" className="text-sm font-medium">
            Maintenance Message
          </Label>
          <Textarea
            id="maint-msg"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="We'll be back soon. Under maintenance."
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This message is shown to visitors when the site is in maintenance mode.
          </p>
          {maintenanceMode.active && (
            <Button
              size="sm"
              variant="outline"
              className="mt-1"
              onClick={() => {
                setMaintenanceMode(true, messageInput);
                toast.success("Maintenance message updated");
              }}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Update Message
            </Button>
          )}
        </div>
      </div>

      {/* Passkey confirmation dialog */}
      <Dialog open={passkeyDialogOpen} onOpenChange={setPasskeyDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Confirm with Passkey
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Enter your admin passkey to{" "}
            {pendingAction?.active ? "enable maintenance mode" : "go live"}.
          </p>
          <div className="mt-2">
            <Input
              type="password"
              placeholder="Admin passkey"
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                setPasskeyError(false);
              }}
              className={passkeyError ? "border-destructive" : ""}
              onKeyDown={(e) => e.key === "Enter" && confirmToggle()}
            />
            {passkeyError && (
              <p className="text-xs text-destructive mt-1">Invalid passkey</p>
            )}
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setPasskeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={confirmToggle}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main Admin Dashboard
function AdminDashboard() {
  const { adminLogout, products, orders, customOrders, clothingOrders, complaints } = useApp();

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingCustomOrders = customOrders.filter((o) => o.status === "pending").length;
  const pendingClothingOrders = clothingOrders.filter((o) => o.status === "pending").length;
  const pendingComplaints = complaints.filter((c) => !c.reply).length;

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
          <div className="bg-card rounded-xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <Paintbrush className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold font-display">
                  {pendingCustomOrders}
                  {pendingCustomOrders > 0 && (
                    <span className="text-sm text-amber-600 ml-1">⚠</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Custom Requests</p>
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
            <TabsTrigger value="custom-orders" className="gap-2">
              <Paintbrush className="h-4 w-4" />
              Custom Orders
              {pendingCustomOrders > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-xs">
                  {pendingCustomOrders}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="clothes" className="gap-2">
              <Shirt className="h-4 w-4" />
              Clothes
            </TabsTrigger>
            <TabsTrigger value="clothing-orders" className="gap-2">
              <Shirt className="h-4 w-4" />
              Clothing Orders
              {pendingClothingOrders > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-xs">
                  {pendingClothingOrders}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="complaints" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Complaints
              {pendingComplaints > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs">
                  {pendingComplaints}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
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
          <TabsContent value="custom-orders">
            <CustomOrdersAdminTab />
          </TabsContent>
          <TabsContent value="clothes">
            <ClothesAdminTab />
          </TabsContent>
          <TabsContent value="clothing-orders">
            <ClothingOrdersAdminTab />
          </TabsContent>
          <TabsContent value="complaints">
            <ComplaintsAdminTab />
          </TabsContent>
          <TabsContent value="maintenance">
            <MaintenanceTab />
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
