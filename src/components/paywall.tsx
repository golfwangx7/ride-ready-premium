import { Sparkles, Check, X, Crown } from "lucide-react";
import { usePremium } from "@/context/premium-context";

export function Paywall() {
  const { paywallOpen, closePaywall, setPremium } = usePremium();
  if (!paywallOpen) return null;

  const upgrade = () => {
    setPremium(true);
    closePaywall();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={closePaywall}
        className="absolute inset-0 animate-fade-in bg-background/80 backdrop-blur-md"
      />
      <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-t-3xl border border-primary/30 bg-card/95 p-7 backdrop-blur-2xl sm:rounded-3xl">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />

        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />

        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <div
              className="absolute inset-0 -m-2 rounded-2xl opacity-60 blur-xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-card">
              <Crown className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">Go Premium</h2>
          <p className="mt-2 max-w-[300px] text-sm text-muted-foreground">
            Make your garage truly yours with personalized vehicle photos and more.
          </p>
        </div>

        <ul className="relative mt-6 space-y-2.5">
          <Feature text="Upload custom vehicle photos" />
          <Feature text="Auto background removal & enhancement" />
          <Feature text="Premium garage cards" />
          <Feature text="Priority support" />
        </ul>

        <div className="relative mt-7 flex items-center justify-center gap-1.5">
          <span className="font-display text-3xl font-light">$4.99</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">/ month</span>
        </div>

        <button
          type="button"
          onClick={upgrade}
          className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to Premium
        </button>

        <button
          type="button"
          onClick={closePaywall}
          className="relative mt-2 w-full py-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="text-sm">{text}</span>
    </li>
  );
}
