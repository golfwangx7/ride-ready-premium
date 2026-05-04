import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, Car, Play, Home, Newspaper, User, MapPin, TrendingUp, Clock } from "lucide-react";
import roadBg from "@/assets/road-bg.jpg";
import mapMini from "@/assets/map-mini.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type Mode = "moto" | "car";

function Index() {
  const [mode, setMode] = useState<Mode>("moto");

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={roadBg}
          alt=""
          width={1536}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[2px] animate-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-28 pt-14">
        {/* Header */}
        <header className="animate-fade-up flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
            <p className="mt-1 font-display text-base font-medium">Alex</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md">
            <span className="text-sm font-medium">A</span>
          </div>
        </header>

        {/* Hero text */}
        <section className="animate-fade-up mt-10" style={{ animationDelay: "100ms" }}>
          <h1 className="font-display text-[2.6rem] font-light leading-[1.05] tracking-tight">
            Ready for your
            <br />
            <span className="font-medium italic text-primary">next ride?</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick your machine. The road is waiting.
          </p>
        </section>

        {/* Toggle */}
        <section className="animate-fade-up mt-8" style={{ animationDelay: "200ms" }}>
          <div className="relative grid grid-cols-2 rounded-full border border-border bg-card/50 p-1.5 backdrop-blur-xl">
            <span
              className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: mode === "moto" ? "0.375rem" : "calc(50% + 0rem)",
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow-sm)",
              }}
            />
            <ToggleBtn active={mode === "moto"} onClick={() => setMode("moto")}>
              <Bike className="h-4 w-4" />
              Motorcycle
            </ToggleBtn>
            <ToggleBtn active={mode === "car"} onClick={() => setMode("car")}>
              <Car className="h-4 w-4" />
              Car
            </ToggleBtn>
          </div>
        </section>

        {/* Start button */}
        <section className="animate-fade-up mt-12 flex flex-col items-center" style={{ animationDelay: "300ms" }}>
          <button
            type="button"
            className="group animate-glow-pulse relative flex h-44 w-44 items-center justify-center rounded-full transition-transform duration-500 hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <span className="absolute inset-2 rounded-full border border-white/10" />
            <div className="relative flex flex-col items-center text-primary-foreground">
              <Play className="h-8 w-8 fill-current" strokeWidth={0} />
              <span className="mt-2 font-display text-lg font-semibold tracking-wide">Start Ride</span>
            </div>
          </button>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Tap to begin tracking
          </p>
        </section>

        {/* Last ride card */}
        <section className="animate-fade-up mt-auto pt-10" style={{ animationDelay: "400ms" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Last ride</h2>
            <button className="text-xs text-primary hover:text-primary/80">View all</button>
          </div>
          <article
            className="group relative overflow-hidden rounded-2xl border border-border backdrop-blur-xl transition-all hover:border-primary/40"
            style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={mapMini}
                alt="Route map"
                width={1024}
                height={512}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur-md">
                <MapPin className="h-3 w-3 text-primary" />
                Pacific Coast Hwy
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Distance" value="84.2 km" />
              <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Duration" value="1h 42m" />
              <Stat label="Top" value="142 km/h" highlight />
            </div>
          </article>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-2 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <NavBtn icon={<Home className="h-5 w-5" />} label="Home" active />
          <NavBtn icon={<Newspaper className="h-5 w-5" />} label="Feed" />
          <NavBtn icon={<User className="h-5 w-5" />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors duration-300 ${
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={`font-display text-sm font-semibold ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}

function NavBtn({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
        active
          ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.3)]"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {active && <span>{label}</span>}
    </button>
  );
}
