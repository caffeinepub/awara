import { useState } from "react";
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
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { Product, Category } from "../types";
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

// Orders Tab
function OrdersTab() {
  const { orders, updateOrderStatus, upiId, setUpiId } = useApp();
  const [editingUpi, setEditingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState(upiId);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* UPI Settings */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold font-display mb-3">UPI Payment Settings</h3>
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
          <TabsList className="mb-6">
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
