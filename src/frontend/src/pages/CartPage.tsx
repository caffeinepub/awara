import { Link } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function CartPage() {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal, cartCount } = useApp();

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.info(`${name} removed from cart`);
  };

  const deliveryCharge = cartTotal >= 499 ? 0 : 49;
  const finalTotal = cartTotal + deliveryCharge;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Shopping Cart
          {cartCount > 0 && (
            <Badge className="bg-primary text-primary-foreground ml-1">
              {cartCount} items
            </Badge>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h2 className="text-xl font-semibold font-display mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-card rounded-xl p-4 flex gap-4 shadow-card animate-fade-in"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm font-display leading-tight line-clamp-2">
                        {item.product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id, item.product.name)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {item.product.category}
                    </Badge>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-muted transition-colors"
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-muted transition-colors"
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-foreground font-display">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-5 shadow-card sticky top-24">
                <h2 className="font-bold font-display text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartCount} items)
                    </span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={
                        deliveryCharge === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {deliveryCharge === 0
                        ? "FREE"
                        : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {cartTotal < 499 && (
                    <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                      Add ₹{(499 - cartTotal).toLocaleString("en-IN")} more for free delivery
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
