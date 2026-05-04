import { useState } from "react";
import { Sparkles, Check, X, Crown } from "lucide-react";
import { usePremium } from "@/context/premium-context";

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
      <div className="animate-fade-up dark relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/20 bg-card/95 backdrop-blur-2xl sm:max-h-[90vh] sm:rounded-3xl">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
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

        <div className="relative flex-1 overflow-y-auto px-6 pb-2 pt-9 sm:px-8">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-border sm:hidden" />

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
            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.32em] text-primary">
              Rydr Premium
            </p>
            <h2 className="mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-tight">
              Upgrade to Rydr Premium
            </h2>
            <p className="mt-2.5 max-w-[280px] text-sm text-muted-foreground">
              Pick a plan and unlock the full experience.
            </p>
          </div>

          {/* Plans */}
          <div className="mt-8 space-y-3">
            <PlanRow
              active={plan === "yearly"}
              onClick={() => setPlan("yearly")}
              label="Yearly"
              price="$29.99"
              suffix="per year"
              equivalent="≈ $2.50 / month"
              badge="Best Value"
              note="Save 40% compared to monthly"
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
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
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
