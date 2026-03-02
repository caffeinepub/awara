import { useState, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Upload,
  CheckCircle,
  Shirt,
  QrCode,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { ClothingConfig } from "../types";

// Color swatch selector
function ColorSwatch({
  colors,
  selectedColor,
  onSelect,
}: {
  colors: ClothingConfig["colors"];
  selectedColor: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {colors.map((c) => (
        <button
          key={c.color}
          type="button"
          title={`${c.color}${c.extraPrice > 0 ? ` (+₹${c.extraPrice})` : ""}`}
          onClick={() => onSelect(c.color)}
          className={`relative w-7 h-7 rounded-full border-2 transition-all duration-150 ${
            selectedColor === c.color
              ? "ring-2 ring-offset-2 ring-primary scale-110 border-primary"
              : "border-border hover:scale-105"
          }`}
          style={{ backgroundColor: c.hex }}
          aria-label={c.color}
        >
          {selectedColor === c.color && (
            <span className="absolute inset-0 flex items-center justify-center">
              <CheckCircle
                className="h-3.5 w-3.5 drop-shadow"
                style={{ color: c.hex === "#f5f5f5" || c.hex === "#fdd835" ? "#333" : "#fff" }}
              />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Single clothing item card
function ClothingItemCard({
  config,
  onSubmit,
}: {
  config: ClothingConfig;
  onSubmit: (
    colorName: string,
    colorHex: string,
    colorExtraPrice: number,
    designImageUrl: string | undefined,
    notes: string,
    customerName: string,
    contact: string,
    deliveryAddress: string
  ) => void;
}) {
  const defaultColor = config.colors[0]?.color ?? "";
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [designImageUrl, setDesignImageUrl] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedColorObj = config.colors.find((c) => c.color === selectedColor) ?? config.colors[0];
  const totalPrice = config.baseCost + (selectedColorObj?.extraPrice ?? 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDesignImageUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) { toast.error("Enter your name"); return; }
    if (!contact.trim() || contact.length < 10) { toast.error("Enter a valid phone number"); return; }
    if (!deliveryAddress.trim()) { toast.error("Enter your delivery address"); return; }

    onSubmit(
      selectedColor,
      selectedColorObj?.hex ?? "#000",
      selectedColorObj?.extraPrice ?? 0,
      designImageUrl,
      notes,
      customerName,
      contact,
      deliveryAddress
    );
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col items-center gap-3 text-center">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <h3 className="font-bold font-display text-lg">{config.name}</h3>
        <p className="text-muted-foreground text-sm">
          Order submitted! Check your status below.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setNotes("");
            setDesignImageUrl(undefined);
            setCustomerName("");
            setContact("");
            setDeliveryAddress("");
            setSelectedColor(defaultColor);
            setShowForm(false);
          }}
        >
          Place Another
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
      {/* Product image + color tint overlay */}
      <div className="relative bg-muted/30 flex items-center justify-center p-6 min-h-[200px]">
        <div
          className="absolute inset-0 opacity-20 transition-colors duration-300"
          style={{ backgroundColor: selectedColorObj?.hex ?? "transparent" }}
        />
        <img
          src={config.imageUrl}
          alt={config.name}
          className="relative z-10 w-44 h-44 object-contain drop-shadow-md"
        />
        {/* Upload design button */}
        <button
          type="button"
          title="Upload custom design"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 z-20 bg-primary text-primary-foreground rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Plus className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {designImageUrl && (
          <div className="absolute bottom-3 left-3 z-20 w-10 h-10 rounded-lg overflow-hidden border-2 border-primary shadow">
            <img src={designImageUrl} alt="Your design" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold font-display text-base">{config.name}</h3>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">₹{totalPrice.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">Base ₹{config.baseCost}</p>
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">
            Color: <span className="font-medium text-foreground">{selectedColor}</span>
            {(selectedColorObj?.extraPrice ?? 0) > 0 && (
              <span className="text-primary ml-1">(+₹{selectedColorObj?.extraPrice})</span>
            )}
          </p>
          <ColorSwatch
            colors={config.colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>

        {!showForm ? (
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 gap-2"
            onClick={() => setShowForm(true)}
          >
            <Shirt className="h-4 w-4" />
            Customize & Order
          </Button>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-3 mt-3">
            <Separator />
            <div>
              <Label htmlFor={`notes-${config.id}`} className="text-xs">
                Custom Notes (optional)
              </Label>
              <Textarea
                id={`notes-${config.id}`}
                placeholder="e.g. Print logo on left chest, size L"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 text-sm resize-none"
              />
            </div>
            {designImageUrl && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <img src={designImageUrl} alt="Design" className="w-10 h-10 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Design uploaded ✓</p>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => setDesignImageUrl(undefined)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {!designImageUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload your design image (optional)
              </button>
            )}
            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Details</p>
            <div>
              <Label htmlFor={`name-${config.id}`} className="text-xs">Full Name *</Label>
              <Input
                id={`name-${config.id}`}
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`phone-${config.id}`} className="text-xs">Phone Number *</Label>
              <Input
                id={`phone-${config.id}`}
                type="tel"
                placeholder="10-digit mobile"
                value={contact}
                onChange={(e) => setContact(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`addr-${config.id}`} className="text-xs">Delivery Address *</Label>
              <Input
                id={`addr-${config.id}`}
                placeholder="House no, Street, City, PIN"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
              >
                Request Custom Order
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// My clothing orders section
function MyClothingOrders() {
  const { getMyClothingOrders, upiQrImageUrl } = useApp();
  const myOrders = getMyClothingOrders();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (myOrders.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Shirt className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No custom clothing orders yet</p>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: "Pending Review", className: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
    quoted: { label: "Price Quoted", className: "bg-green-100 text-green-800", icon: <BadgeCheck className="h-3 w-3" /> },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600", icon: null },
  };

  return (
    <div className="space-y-3">
      {myOrders.map((order) => {
        const cfg = statusConfig[order.status];
        return (
          <div
            key={order.id}
            className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
              <Shirt className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
                  {cfg.icon}
                  {cfg.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 12)}…</span>
              </div>
              <p className="font-medium text-sm">{order.clothingName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block w-4 h-4 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: order.colorHex }}
                />
                <span className="text-xs text-muted-foreground">{order.colorName}</span>
              </div>
              {order.status === "quoted" && order.quotedPrice !== undefined && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-green-800 mb-2">
                    <QrCode className="inline h-4 w-4 mr-1" />
                    Admin quoted: ₹{order.quotedPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-green-700 mb-2">Scan the QR below to pay:</p>
                  {upiQrImageUrl ? (
                    <div className="flex flex-col items-center gap-2 bg-white rounded-lg p-3 w-fit">
                      <img
                        src={upiQrImageUrl}
                        alt="UPI QR"
                        className="w-28 h-28 object-contain"
                      />
                      <p className="text-base font-bold text-primary">
                        Scan &amp; Pay ₹{order.quotedPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700">UPI QR not configured. Contact support.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Design Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img src={previewImage} alt="Design" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CustomClothesPage() {
  const { clothingConfigs, submitClothingOrder } = useApp();

  const handleSubmitOrder = (
    configId: string,
    clothingName: string,
    baseCost: number,
    colorName: string,
    colorHex: string,
    colorExtraPrice: number,
    customerDesignImageUrl: string | undefined,
    notes: string,
    customerName: string,
    contact: string,
    deliveryAddress: string
  ) => {
    submitClothingOrder({
      clothingId: configId,
      clothingName,
      colorName,
      colorHex,
      baseCost,
      colorExtraPrice,
      customerDesignImageUrl,
      notes: notes || undefined,
      customerName,
      contact,
      deliveryAddress,
    });
    toast.success("Custom order submitted! Check status below.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shirt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Custom Clothes</h1>
              <p className="text-muted-foreground text-sm">
                Pick a garment, choose your color, upload your design — we'll print it for you.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap text-xs">
            <span className="bg-muted px-3 py-1 rounded-full text-muted-foreground">🎨 Custom designs welcome</span>
            <span className="bg-muted px-3 py-1 rounded-full text-muted-foreground">📦 Admin confirms final price</span>
            <span className="bg-muted px-3 py-1 rounded-full text-muted-foreground">💳 Pay via UPI after confirmation</span>
          </div>
        </div>

        {/* Clothing items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {clothingConfigs.map((config) => (
            <ClothingItemCard
              key={config.id}
              config={config}
              onSubmit={(colorName, colorHex, colorExtraPrice, designImg, notes, name, contact, address) =>
                handleSubmitOrder(
                  config.id,
                  config.name,
                  config.baseCost,
                  colorName,
                  colorHex,
                  colorExtraPrice,
                  designImg,
                  notes,
                  name,
                  contact,
                  address
                )
              }
            />
          ))}
        </div>

        {/* My orders section */}
        <div>
          <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            My Clothing Orders
          </h2>
          <MyClothingOrders />
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
