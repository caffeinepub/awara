import { Mail, ArrowLeft, LifeBuoy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useApp } from "../context/AppContext";

export function SupportPage() {
  const { supportEmail } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center animate-slide-up">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card"
            style={{ background: "oklch(var(--primary) / 0.10)" }}
          >
            <LifeBuoy
              className="w-10 h-10"
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>

          {/* Heading */}
          <h1
            className="text-3xl font-bold font-display mb-3"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Support
          </h1>

          {/* Subtext */}
          <p
            className="text-base mb-8 leading-relaxed"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {supportEmail
              ? "Have a question or need help? Reach out to us — we're here for you."
              : "Contact our team for help."}
          </p>

          {/* Email */}
          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-base font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-card-hover"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <Mail className="w-5 h-5" />
              {supportEmail}
            </a>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm border"
              style={{
                borderColor: "oklch(var(--border))",
                color: "oklch(var(--muted-foreground))",
                background: "oklch(var(--card))",
              }}
            >
              <Mail className="w-4 h-4" />
              No support email configured yet
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
