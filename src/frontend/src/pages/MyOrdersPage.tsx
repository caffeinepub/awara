import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Package,
  XCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import type { Order } from "../types";

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Processing",
    className: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-3 w-3" />,
  },
  approved: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  denied: {
    label: "Denied",
    className: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const { requestCancellation } = useApp();
  const statusCfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.pending;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canRequestCancellation =
    order.status !== "cancelled" &&
    order.status !== "denied" &&
    !order.cancellationRequested;

  const handleRequestCancellation = () => {
    if (!confirm("Request cancellation for this order?")) return;
    requestCancellation(order.id);
    toast.success("Cancellation requested. We'll review it shortly.");
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
      {/* Header row */}
      <div className="px-4 py-3 flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">
              {order.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}
            >
              {statusCfg.icon}
              {statusCfg.label}
            </span>
            {order.cancellationRequested && order.cancellationStatus === "pending" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                <AlertTriangle className="h-3 w-3" />
                Cancellation Requested
              </span>
            )}
            {order.cancellationStatus === "denied" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                <XCircle className="h-3 w-3" />
                Cancellation Denied
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground">{date}</span>
            <span className="text-xs text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs font-semibold text-foreground">
              ₹{order.total.toLocaleString("en-IN")}
            </span>
            <Badge variant="secondary" className="text-xs">
              {order.paymentMethod}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canRequestCancellation && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleRequestCancellation}
            >
              Cancel Order
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Customer</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Contact</p>
              <p className="font-medium">{order.contact || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
              <p className="font-medium">{order.deliveryAddress || "—"}</p>
            </div>
          </div>

          <Separator />

          {/* Items list */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-10 h-10 rounded-lg object-cover bg-muted border border-border shrink-0"
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

          <Separator />

          <div className="flex justify-end">
            <p className="text-sm font-bold">
              Total:{" "}
              <span className="text-primary">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyOrdersPage() {
  const { orders } = useApp();

  // Show in reverse chronological order (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">My Orders</h1>
            <p className="text-muted-foreground text-sm">
              {sortedOrders.length} order{sortedOrders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold font-display mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping and your orders will appear here.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
