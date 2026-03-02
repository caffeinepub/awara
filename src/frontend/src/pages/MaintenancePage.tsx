import { Link } from "@tanstack/react-router";
import { Wrench, Package } from "lucide-react";
import { useApp } from "../context/AppContext";

export function MaintenancePage() {
  const { maintenanceMode } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <Package className="h-8 w-8 text-primary" />
        <span className="text-3xl font-bold font-display text-primary">AWARA</span>
      </div>

      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <Wrench className="h-10 w-10 text-primary" />
      </div>

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-3">
        We'll be right back!
      </h1>
      <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
        {maintenanceMode.message || "We're currently under maintenance. Please check back soon."}
      </p>

      <div className="mt-6 flex items-center gap-2 text-muted-foreground text-sm">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Maintenance in progress</span>
      </div>

      {/* Admin link */}
      <div className="mt-16">
        <Link
          to="/admin"
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
