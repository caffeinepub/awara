import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ShoppingBag, Package, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { Order } from "../types";

function QRCodeDisplay({ upiId }: { upiId: string }) {
  // Visual QR code placeholder using CSS grid
  const cells: Array<{ key: string; filled: boolean }> = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const isFinderTL = row < 3 && col < 3;
      const isFinderTR = row < 3 && col > 11;
      const isFinderBL = row > 11 && col < 3;
      const isData = !isFinderTL && !isFinderTR && !isFinderBL;
      const pattern = (row * 13 + col * 7 + row * col) % 4 === 0;
      cells.push({
        key: `qr-r${row}-c${col}`,
        filled: isFinderTL || isFinderTR || isFinderBL || (isData && pattern),
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-card border border-border w-fit mx-auto">
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: "repeat(15, 1fr)", width: "150px" }}
      >
        {cells.map(({ key, filled }) => (
          <div
            key={key}
            className="aspect-square rounded-sm"
            style={{ backgroundColor: filled ? "#1a1a1a" : "transparent" }}
          />
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-foreground">Scan & Pay via UPI</p>
        <p className="text-sm font-bold text-primary">{upiId}</p>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { cartItems, cartTotal, upiId, upiQrImageUrl, placeOrder, freeDeliveryThreshold, codEnabled, getEffectivePrice } = useApp();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  // Auto-switch away from COD if it gets disabled
  useEffect(() => {
    if (!codEnabled && paymentMethod === "cod") {
      setPaymentMethod("upi");
    }
  }, [codEnabled, paymentMethod]);

  const deliveryCharge = cartTotal >= freeDeliveryThreshold ? 0 : 49;
  const finalTotal = cartTotal + deliveryCharge;

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    const methodLabel =
      paymentMethod === "upi"
        ? "UPI"
        : paymentMethod === "cod"
        ? "Cash on Delivery"
        : "Card Payment";

    const order = placeOrder(methodLabel, customerName, phone, address);
    setOrderPlaced(order);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h2 className="text-xl font-semibold font-display mb-2">
              Your cart is empty
            </h2>
            <Link to="/">
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md animate-slide-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-display mb-2">
              Order Placed!
            </h2>
            <p className="text-muted-foreground mb-2">
              Order ID: <span className="font-mono font-medium text-foreground">{orderPlaced.id}</span>
            </p>
            <p className="text-muted-foreground mb-6">
              We'll process and ship your order soon. Thank you for shopping with AWARA!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-6">
              <p className="text-sm font-medium text-green-800">
                ✅ What happens next?
              </p>
              <ul className="mt-2 space-y-1 text-xs text-green-700">
                <li>• Your order has been received</li>
                <li>• We'll pack and dispatch it shortly</li>
                <li>• Track your order in My Orders</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/my-orders">
                <Button variant="outline" className="gap-2">
                  <Package className="h-4 w-4" />
                  View My Orders
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/cart" })}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold font-display">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Info */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-bold font-display mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    placeholder="House no, Street, City, PIN code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-bold font-display mb-4">Payment Method</h2>
              <div className="space-y-3">
                {(
                  [
                    { id: "upi", label: "Pay via UPI / QR Code", emoji: "📲", desc: "PhonePe, GPay, Paytm, any UPI" },
                    ...(codEnabled ? [{ id: "cod" as const, label: "Cash on Delivery", emoji: "💵", desc: "Pay when delivered" }] : []),
                    { id: "card", label: "Credit / Debit Card", emoji: "💳", desc: "Visa, Mastercard, RuPay" },
                  ] as const
                ).map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-primary"
                    />
                    <span className="text-xl">{method.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Mock
                    </Badge>
                  </label>
                ))}
              </div>

              {/* UPI QR Code */}
              {paymentMethod === "upi" && (
                <div className="mt-5 animate-fade-in">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Scan the QR code with any UPI app to pay
                  </p>
                  {upiQrImageUrl ? (
                    <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-card border border-border w-fit mx-auto">
                      <img
                        src={upiQrImageUrl}
                        alt="UPI QR Code"
                        className="w-40 h-40 object-contain mx-auto rounded-xl border"
                      />
                      <div className="text-center">
                        <p className="text-xs font-medium text-foreground">Scan & Pay via UPI</p>
                        <p className="text-sm font-bold text-primary">{upiId}</p>
                      </div>
                    </div>
                  ) : (
                    <QRCodeDisplay upiId={upiId} />
                  )}
                  <p className="text-center mt-4">
                    <span className="text-2xl font-bold text-primary">
                      Scan &amp; Pay ₹{finalTotal.toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mt-4 animate-fade-in p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  💳 Card payment integration coming soon. Your order will be placed and payment collected on delivery.
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-5 shadow-card sticky top-24">
              <h2 className="font-bold font-display mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => {
                  const effPrice = getEffectivePrice(item.product);
                  const isDiscounted = effPrice < item.product.price;
                  return (
                    <div key={item.product.id} className="flex gap-3 text-sm">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-lg object-cover bg-muted shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium leading-tight line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Qty: {item.quantity} ×{" "}
                          {isDiscounted ? (
                            <>
                              <span className="text-foreground font-medium">₹{effPrice.toLocaleString("en-IN")}</span>
                              {" "}
                              <span className="line-through">₹{item.product.price.toLocaleString("en-IN")}</span>
                            </>
                          ) : (
                            `₹${effPrice.toLocaleString("en-IN")}`
                          )}
                        </p>
                      </div>
                      <span className="font-medium shrink-0">
                        ₹{(effPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={handlePlaceOrder}
              >
                <CheckCircle className="h-4 w-4" />
                Confirm Order
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Your order will be processed and shipped after confirmation
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
