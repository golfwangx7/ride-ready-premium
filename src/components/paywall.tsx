import { useState } from "react";
import { Sparkles, Check, X, Crown, BarChart3, Share2, Car, Map, Sparkle } from "lucide-react";
import { usePremium } from "@/context/premium-context";
import heroCar from "@/assets/premium-hero-car.png";

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
      <div className="animate-fade-up dark relative flex max-h-[96vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/20 bg-card/95 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Close */}
        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex-1 overflow-y-auto">
          {/* HERO */}
          <div className="relative overflow-hidden">
            {/* Ambient gradients */}
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, oklch(0.82 0.16 200 / 0.18), transparent 60%)",
              }}
            />
            {/* Subtle grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                color: "oklch(0.82 0.16 200)",
                maskImage:
                  "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
              }}
            />

            <div className="relative px-6 pb-2 pt-9 sm:px-7">
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-border sm:hidden" />

              {/* Badge */}
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
                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.32em] text-primary">
                  Rydr Premium
                </p>
                <h2 className="mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-tight">
                  Upgrade to Rydr Premium
                </h2>
                <p className="mt-2.5 max-w-[300px] text-sm text-muted-foreground">
                  Take your rides to the next level.
                </p>
              </div>

              {/* Hero feature card */}
              <div className="relative mt-7 overflow-hidden rounded-3xl border border-primary/30">
                <div
                  className="absolute inset-0"
                  style={{ background: "var(--gradient-surface)" }}
                />
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl"
                  style={{ background: "var(--gradient-primary)" }}
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
                  style={{ background: "var(--gradient-primary)" }}
                />

                <div className="relative">
                  {/* Visual preview */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <div
                      className="absolute inset-x-6 bottom-3 h-3 rounded-[50%] bg-primary/30 blur-md"
                      aria-hidden
                    />
                    <img
                      src={heroCar}
                      alt="Premium vehicle preview"
                      width={1024}
                      height={640}
                      className="absolute inset-0 h-full w-full object-contain p-3 drop-shadow-[0_20px_30px_oklch(0.82_0.16_200/0.25)]"
                    />
                    {/* AI tag */}
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-md">
                      <Sparkle className="h-3 w-3" /> AI Enhanced
                    </span>
                  </div>

                  <div className="px-5 pb-5 pt-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-primary">
                      Featured
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
                      Add your real vehicle with AI-enhanced visuals
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                      Snap a photo — Rydr removes the background and refines it into a
                      stunning, premium garage card.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="px-6 pb-6 pt-6 sm:px-7">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Also included
            </p>
            <ul className="grid grid-cols-2 gap-2.5">
              <FeatureTile
                icon={<BarChart3 className="h-4 w-4" />}
                title="Advanced stats"
                desc="Deeper ride insights"
              />
              <FeatureTile
                icon={<Share2 className="h-4 w-4" />}
                title="Custom shares"
                desc="Stand out anywhere"
              />
              <FeatureTile
                icon={<Car className="h-4 w-4" />}
                title="Multiple vehicles"
                desc="Build your garage"
              />
              <FeatureTile
                icon={<Map className="h-4 w-4" />}
                title="Premium routes"
                desc="Curated for drivers"
              />
            </ul>

            {/* PLANS */}
            <p className="mb-3 mt-7 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Choose your plan
            </p>
            <div className="grid grid-cols-2 gap-2.5">
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
                badge="Best value"
                hint="≈ $2.50 / mo"
              />
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="relative border-t border-border/60 bg-card/85 px-6 pb-6 pt-4 backdrop-blur-xl sm:px-7">
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

function FeatureTile({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-border bg-background/40 p-3.5 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-tight">{title}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Check
        className="absolute bottom-2 right-2 h-3 w-3 text-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
        strokeWidth={3}
      />
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
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: string;
  suffix: string;
  badge?: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start rounded-2xl border px-4 py-4 text-left transition-all ${
        active
          ? "border-primary/60 bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.3),0_8px_24px_-12px_oklch(0.82_0.16_200/0.4)]"
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
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 font-display text-2xl font-light tabular-nums">{price}</span>
      <span className="text-[10px] text-muted-foreground">{suffix}</span>
      {hint && (
        <span className="mt-1 text-[10px] font-medium text-primary">{hint}</span>
      )}
    </button>
  );
}
