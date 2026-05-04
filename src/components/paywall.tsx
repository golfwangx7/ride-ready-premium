import { useState } from "react";
import { Sparkles, Check, X, Crown, Camera, BarChart3, Share2, Car } from "lucide-react";
import { usePremium } from "@/context/premium-context";

type Plan = "monthly" | "yearly";

export function Paywall() {
  const { paywallOpen, closePaywall, setPremium } = usePremium();
  const [plan, setPlan] = useState<Plan>("yearly");

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
        className="absolute inset-0 animate-fade-in bg-background/85 backdrop-blur-md"
      />
      <div className="animate-fade-up relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/20 bg-card/95 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex-1 overflow-y-auto px-6 pb-6 pt-8 sm:px-7">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div
                className="absolute inset-0 -m-3 rounded-2xl opacity-70 blur-2xl"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-card">
                <Crown className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary">Rydr Premium</p>
            <h2 className="mt-2 font-display text-[26px] font-medium leading-tight tracking-tight">
              Upgrade to Rydr Premium
            </h2>
            <p className="mt-2 max-w-[300px] text-sm text-muted-foreground">
              Unlock the full Rydr experience — built for drivers who want more.
            </p>
          </div>

          {/* Highlight feature */}
          <div className="relative mt-7 overflow-hidden rounded-2xl border border-primary/30">
            <div
              className="absolute inset-0 opacity-90"
              style={{ background: "var(--gradient-surface)" }}
            />
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative flex items-center gap-4 p-5">
              <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-background/50">
                <Camera className="h-7 w-7 text-primary" strokeWidth={1.5} />
                <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary">
                  AI
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Featured</p>
                <h3 className="mt-1 font-display text-base font-semibold leading-tight">
                  Add your real vehicle with AI-enhanced visuals
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  Snap a photo — we remove the background and polish it into a premium garage card.
                </p>
              </div>
            </div>
          </div>

          {/* Other features */}
          <ul className="mt-5 space-y-2">
            <Feature icon={<BarChart3 className="h-3.5 w-3.5" />} title="Advanced ride stats" desc="Deeper insights into every drive" />
            <Feature icon={<Share2 className="h-3.5 w-3.5" />} title="Custom share designs" desc="Stand out on Instagram & TikTok" />
            <Feature icon={<Car className="h-3.5 w-3.5" />} title="Multiple vehicles" desc="Manage your full garage" />
          </ul>

          {/* Plans */}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <PlanOption
              active={plan === "monthly"}
              onClick={() => setPlan("monthly")}
              label="Monthly"
              price="$4.99"
              suffix="/ month"
            />
            <PlanOption
              active={plan === "yearly"}
              onClick={() => setPlan("yearly")}
              label="Yearly"
              price="$29.99"
              suffix="/ year"
              badge="Save 50%"
            />
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="relative border-t border-border/60 bg-card/80 px-6 pb-6 pt-4 backdrop-blur-xl sm:px-7">
          <button
            type="button"
            onClick={upgrade}
            className="group flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Start Premium
          </button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Cancel anytime · Auto-renews until cancelled
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Check className="h-4 w-4 shrink-0 text-primary/70" strokeWidth={2.5} />
    </li>
  );
}

function PlanOption({
  active,
  onClick,
  label,
  price,
  suffix,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: string;
  suffix: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start rounded-2xl border px-4 py-3.5 text-left transition-all ${
        active
          ? "border-primary/50 bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.25)]"
          : "border-border bg-background/40 hover:border-primary/30"
      }`}
    >
      {badge && (
        <span
          className="absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          {badge}
        </span>
      )}
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="mt-1 font-display text-xl font-light tabular-nums">{price}</span>
      <span className="text-[10px] text-muted-foreground">{suffix}</span>
    </button>
  );
}
