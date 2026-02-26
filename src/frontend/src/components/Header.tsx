import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Search, Menu, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "../context/AppContext";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  const { cartCount } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <Package className="h-7 w-7 text-primary-foreground" />
              <span
                className="text-2xl font-bold text-primary-foreground tracking-wider"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                AWARA
              </span>
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 hidden sm:flex items-center bg-white rounded-full overflow-hidden shadow-sm max-w-xl"
          >
            <Input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              className="border-none rounded-full bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-full mr-1 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary-foreground hover:bg-white/20"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold border-2 border-primary">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <button
              type="button"
              className="sm:hidden text-primary-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex sm:hidden items-center bg-white rounded-full overflow-hidden shadow-sm mt-2"
        >
          <Input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            className="border-none rounded-full bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-full mr-1 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
