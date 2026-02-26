import { Link } from "@tanstack/react-router";
import { Heart, Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-display text-primary">
                AWARA
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Your one-stop shop for quality products delivered across India.
              Shop with confidence, shop with AWARA.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold font-display mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="hover:text-primary transition-colors"
                >
                  Checkout
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold font-display mb-3 text-white">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                "Household",
                "Clothes",
                "Bedsheet",
                "Stickers",
                "Toys",
                "Mobile Covers",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/"
                    className="hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <p>© 2026. Built with <Heart className="inline h-3.5 w-3.5 text-primary fill-primary" /> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <Link
            to="/admin"
            className="text-white/40 hover:text-white/70 transition-colors text-xs"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
