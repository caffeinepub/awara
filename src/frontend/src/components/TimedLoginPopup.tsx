import { useState, useEffect, useRef } from "react";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "../context/AppContext";

const SHOW_AT_MINUTES = [0, 1, 3, 7];
const SESSION_KEY = "awara_popup_dismissed";

export function TimedLoginPopup() {
  const { isAdminLoggedIn } = useApp();
  const [visible, setVisible] = useState(false);
  const shownTimesRef = useRef<Set<number>>(new Set());
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    // Don't show if admin is logged in or already dismissed this session
    if (isAdminLoggedIn) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    const handleDismissed = () => {
      // When dismissed, clear all pending timers
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current = [];
    };

    SHOW_AT_MINUTES.forEach((minutes) => {
      const ms = minutes * 60 * 1000;
      const t = setTimeout(() => {
        // Re-check session storage in case it was dismissed between timers
        if (sessionStorage.getItem(SESSION_KEY) === "1") return;
        if (isAdminLoggedIn) return;

        shownTimesRef.current.add(minutes);
        setVisible(true);
      }, ms);
      timerRefs.current.push(t);
    });

    return handleDismissed;
  }, [isAdminLoggedIn]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
    // Clear all remaining timers — no more pop-ups this session
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in prompt"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-slide-up"
    >
      <div
        className="rounded-2xl shadow-2xl border border-border overflow-hidden"
        style={{
          background: "oklch(var(--card))",
          borderColor: "oklch(var(--primary) / 0.3)",
        }}
      >
        {/* Accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "oklch(var(--primary))" }}
        />

        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div
            className="mt-0.5 shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.12)",
            }}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-sm leading-snug"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Sign in to save your cart and wishlist
            </p>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Your items are safe once you log in.
            </p>
          </div>

          {/* Dismiss */}
          <Button
            variant="ghost"
            size="icon"
            onClick={dismiss}
            aria-label="Dismiss"
            className="h-7 w-7 shrink-0 rounded-lg hover:bg-muted"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
