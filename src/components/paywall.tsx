import { useState } from "react";
import { Sparkles, Check, X, Crown, BarChart3, Palette, Car, Map } from "lucide-react";
import { usePremium } from "@/context/premium-context";
import heroCar from "@/assets/premium-hero-car.png";

type Plan = "monthly" | "yearly";

export function Paywall() {
  const { paywallOpen, paywallReason, closePaywall, setPremium } = usePremium();
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
      <div className="animate-fade-up dark relative flex max-h-[96vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/15 bg-card/95 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[140%] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex-1 overflow-y-auto px-6 pb-3 pt-9 sm:px-8">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-primary">
              <Crown className="h-3 w-3" strokeWidth={2} />
              Rydr Premium
            </p>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.05] tracking-tight">
              Upgrade to Rydr Premium
            </h2>
            <p className="mt-2 max-w-[300px] text-sm text-muted-foreground">
              Make every ride yours.
            </p>
            {paywallReason && (
              <p className="mt-3 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                {paywallReason}
              </p>
            )}
          </div>

          {/* Hero feature */}
          <div className="relative mt-7 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/[0.08] to-background/60 px-5 pt-5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-10 h-40 opacity-60 blur-2xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative flex flex-col">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-background/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
              <h3 className="mt-3 font-display text-[17px] font-medium leading-snug tracking-tight">
                Add your real vehicle with AI-enhanced visuals
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Turn a quick photo into a polished, studio-grade portrait of your ride.
              </p>
              <div className="relative mt-3 -mb-2 flex justify-center">
                <div
                  aria-hidden
                  className="absolute bottom-2 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/60 blur-md"
                />
                <img
                  src={heroCar}
                  alt="AI-enhanced vehicle preview"
                  className="relative h-28 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>

          {/* Feature list */}
          <ul className="mt-6 grid grid-cols-2 gap-2.5">
            <Feature icon={<BarChart3 className="h-3.5 w-3.5" />} text="Advanced ride stats" />
            <Feature icon={<Palette className="h-3.5 w-3.5" />} text="Custom share styles" />
            <Feature icon={<Car className="h-3.5 w-3.5" />} text="Multiple vehicles" />
            <Feature icon={<Map className="h-3.5 w-3.5" />} text="Premium routes" />
          </ul>

          {/* Plans */}
          <div className="mt-7 space-y-3">
            <PlanRow
              active={plan === "yearly"}
              onClick={() => setPlan("yearly")}
              label="Yearly"
              price="$29.99"
              suffix="per year"
              equivalent="≈ $2.50 / month"
              badge="Best Value"
              note="Save 40%"
              featured
            />
            <PlanRow
              active={plan === "monthly"}
              onClick={() => setPlan("monthly")}
              label="Monthly"
              price="$4.99"
              suffix="per month"
            />
          </div>

          {/* Tiny perks reassurance */}
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
            <Perk text="Cancel anytime" />
            <Perk text="Instant access" />
            <Perk text="All future updates" />
            <Perk text="Secure payment" />
          </ul>
        </div>

        {/* Footer / CTA */}
        <div className="relative border-t border-border/60 bg-card/85 px-6 pb-6 pt-4 backdrop-blur-xl sm:px-8">
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
            {plan === "yearly"
              ? "Billed $29.99 yearly · Auto-renews until cancelled"
              : "Billed $4.99 monthly · Auto-renews until cancelled"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5 text-[12px]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="leading-tight">{text}</span>
    </li>
  );
}

function Perk({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
      {text}
    </li>
  );
}

function PlanRow({
  active,
  onClick,
  label,
  price,
  suffix,
  equivalent,
  badge,
  note,
  featured,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: string;
  suffix: string;
  equivalent?: string;
  badge?: string;
  note?: string;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
        active
          ? "border-primary/60 bg-primary/[0.07] shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.35),0_10px_30px_-15px_oklch(0.82_0.16_200/0.5)]"
          : "border-border bg-background/40 hover:border-primary/30"
      } ${featured ? "min-h-[112px]" : ""}`}
    >
      {badge && (
        <span
          className="absolute -top-2.5 right-4 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          {badge}
        </span>
      )}

      {/* Radio indicator */}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active ? "border-primary bg-primary" : "border-border bg-background/50"
        }`}
      >
        {active && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className={`font-display ${featured ? "text-base" : "text-sm"} font-medium`}>
            {label}
          </p>
          <p
            className={`font-display ${
              featured ? "text-2xl" : "text-xl"
            } font-light tabular-nums`}
          >
            {price}
          </p>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-3 text-[11px] text-muted-foreground">
          <span>{equivalent || "\u00A0"}</span>
          <span>{suffix}</span>
        </div>
        {note && (
          <p className="mt-2 text-[11px] font-medium text-primary">
            {note}
          </p>
        )}
      </div>
    </button>
  );
}
