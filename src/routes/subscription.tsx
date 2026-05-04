import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Crown,
  Sparkles,
  Gauge,
  Car,
  Share2,
  BarChart3,
  Camera,
  Map,
} from "lucide-react";
import { usePremium } from "@/context/premium-context";

export const Route = createFileRoute("/subscription")({
  component: Subscription,
  head: () => ({
    meta: [
      { title: "Subscription · Rydr" },
      { name: "description", content: "Compare Free and Rydr Premium plans." },
    ],
  }),
});

function Subscription() {
  const navigate = useNavigate();
  const { isPremium, openPaywall } = usePremium();

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-24 pt-12">
        <header className="animate-fade-up flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/settings" })}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Subscription
          </p>
          <span className="h-10 w-10" />
        </header>

        <section className="animate-fade-up mt-8 text-center" style={{ animationDelay: "60ms" }}>
          <h1 className="font-display text-2xl font-medium tracking-tight">Choose your plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track every ride. Upgrade when you want more.
          </p>
        </section>

        <div className="mt-8 space-y-4">
          {/* FREE PLAN */}
          <PlanCard
            tone="muted"
            title="Free"
            tag={!isPremium ? "Current plan" : undefined}
            features={[
              { icon: <Gauge className="h-3.5 w-3.5" />, label: "Basic ride tracking" },
              { icon: <BarChart3 className="h-3.5 w-3.5" />, label: "Basic stats" },
              { icon: <Car className="h-3.5 w-3.5" />, label: "Limited vehicles" },
              { icon: <Share2 className="h-3.5 w-3.5" />, label: "Standard share design" },
            ]}
            delay={120}
          />

          {/* PREMIUM PLAN */}
          <PlanCard
            tone="premium"
            title="Rydr Premium"
            badge="Best Experience"
            tag={isPremium ? "Active" : undefined}
            cta={isPremium ? undefined : "See pricing"}
            onClick={isPremium ? undefined : openPaywall}
            features={[
              { icon: <BarChart3 className="h-3.5 w-3.5" />, label: "Advanced ride stats" },
              { icon: <Share2 className="h-3.5 w-3.5" />, label: "Custom share styles" },
              { icon: <Car className="h-3.5 w-3.5" />, label: "Multiple vehicles" },
              { icon: <Camera className="h-3.5 w-3.5" />, label: "AI vehicle images" },
              { icon: <Map className="h-3.5 w-3.5" />, label: "Premium routes" },
            ]}
            delay={200}
          />
        </div>

        {!isPremium && (
          <p
            className="animate-fade-up mt-6 text-center text-[11px] text-muted-foreground"
            style={{ animationDelay: "260ms" }}
          >
            Cancel anytime · No commitment
          </p>
        )}
      </main>
    </div>
  );
}

type Feature = { icon: React.ReactNode; label: string };

function PlanCard({
  tone,
  title,
  badge,
  tag,
  cta,
  onClick,
  features,
  delay,
}: {
  tone: "muted" | "premium";
  title: string;
  badge?: string;
  tag?: string;
  cta?: string;
  onClick?: () => void;
  features: Feature[];
  delay: number;
}) {
  const premium = tone === "premium";
  const interactive = !!onClick;

  const Inner = (
    <>
      {/* Glow for premium */}
      {premium && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
      )}

      {/* Badge */}
      {badge && (
        <span
          className="absolute -top-2.5 left-5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          {badge}
        </span>
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              premium
                ? "border border-primary/40 bg-primary/10 text-primary"
                : "border border-border bg-background/40 text-muted-foreground"
            }`}
          >
            {premium ? (
              <Crown className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Gauge className="h-4 w-4" strokeWidth={1.5} />
            )}
          </span>
          <div>
            <h3 className="font-display text-lg font-medium leading-none">{title}</h3>
            {tag && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                {tag}
              </span>
            )}
          </div>
        </div>
        {interactive && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <ul className="relative mt-5 space-y-2">
        {features.map((f) => (
          <li
            key={f.label}
            className="flex items-center gap-2.5 text-[13px]"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                premium ? "bg-primary/15 text-primary" : "bg-background/60 text-muted-foreground"
              }`}
            >
              {premium ? <Check className="h-3 w-3" strokeWidth={3} /> : f.icon}
            </span>
            <span className={premium ? "text-foreground" : "text-muted-foreground"}>{f.label}</span>
          </li>
        ))}
      </ul>

      {cta && (
        <div
          className="relative mt-5 flex items-center justify-center gap-2 rounded-full py-3 font-display text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
        >
          <Sparkles className="h-4 w-4" />
          {cta}
        </div>
      )}
    </>
  );

  const className = `animate-fade-up relative overflow-hidden rounded-3xl border p-5 backdrop-blur-md transition-[border-color,transform] ${
    premium
      ? "border-primary/30 hover:border-primary/50"
      : "border-border hover:border-border"
  } ${interactive ? "text-left active:scale-[0.99]" : ""}`;

  const style = {
    background: premium
      ? "var(--gradient-surface)"
      : "color-mix(in oklab, var(--card) 70%, transparent)",
    animationDelay: `${delay}ms`,
  };

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={`${className} block w-full`} style={style}>
        {Inner}
      </button>
    );
  }
  return (
    <div className={className} style={style}>
      {Inner}
    </div>
  );
}
