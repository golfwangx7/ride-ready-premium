import { createFileRoute, Link } from "@tanstack/react-router";
import { Share2, Bookmark, ArrowLeft, Gauge, Route as RouteIcon, Clock, Wind, Flag, Car, Bike } from "lucide-react";
import mapSummary from "@/assets/map-summary.jpg";
import { useRide } from "@/context/ride-context";
import { useVehicles } from "@/context/vehicle-context";

export const Route = createFileRoute("/summary")({
  component: Summary,
});

function Summary() {
  const { name } = useRide();
  const { vehicles, activeId } = useVehicles();
  const active = vehicles.find((v) => v.id === activeId) ?? vehicles[0];
  const [first, ...rest] = name.split(" ");
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-32 pt-12">
        {/* Header */}
        <header className="animate-fade-up flex items-center justify-between">
          <Link
            to="/"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Sun · 04 May
          </p>
          <div className="h-10 w-10" />
        </header>

        {/* Title */}
        <section className="animate-fade-up mt-8" style={{ animationDelay: "80ms" }}>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your Ride</p>
          <h1 key={name} className="animate-fade-up mt-2 font-display text-4xl font-light leading-tight tracking-tight">
            {first} {rest.length > 0 && <span className="font-medium italic text-primary">{rest.join(" ")}</span>}
          </h1>
        </section>

        {/* Map */}
        <section className="animate-fade-up mt-7" style={{ animationDelay: "160ms" }}>
          <div
            className="group relative overflow-hidden rounded-3xl border border-border"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <img
              src={mapSummary}
              alt="Ride route map"
              width={1280}
              height={1024}
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">From</p>
                <p className="font-display text-sm font-medium">Twin Peaks</p>
              </div>
              <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">To</p>
                <p className="font-display text-sm font-medium">Half Moon Bay</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats grid */}
        <section className="animate-fade-up mt-6 grid grid-cols-2 gap-3" style={{ animationDelay: "240ms" }}>
          <StatCard icon={<RouteIcon className="h-4 w-4" />} label="Distance" value="84.2" unit="km" featured />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Duration" value="1:42" unit="h" />
          <StatCard icon={<Wind className="h-4 w-4" />} label="Avg Speed" value="49" unit="km/h" />
          <StatCard icon={<Flag className="h-4 w-4" />} label="Stops" value="3" unit="" />
        </section>

        {/* Max speed strip */}
        <section className="animate-fade-up mt-3" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card/40 px-5 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.2em]">Max speed</span>
            </div>
            <p className="font-display text-base font-medium tabular-nums">
              142<span className="ml-1 text-[10px] uppercase tracking-wider text-muted-foreground">km/h</span>
            </p>
          </div>
        </section>

        {/* Active vehicle */}
        {active && (
          <section className="animate-fade-up mt-5" style={{ animationDelay: "380ms" }}>
            <Link
              to="/vehicle/$vehicleId"
              params={{ vehicleId: active.id }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3 backdrop-blur-md transition-all hover:border-primary/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                {active.type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Ridden with</p>
                <p className="truncate font-display text-sm font-medium">{active.name}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                {active.type === "car" ? "Car" : "Moto"}
              </span>
            </Link>
          </section>
        )}
      </main>

      {/* Bottom actions */}
      <footer className="fixed inset-x-0 bottom-0 z-20 px-6 pb-6 pt-10 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            aria-label="Save ride"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur-2xl transition-all hover:scale-105 hover:border-primary/40 active:scale-95"
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <Link
            to="/name-ride"
            className="group relative flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Share2 className="h-4 w-4" />
            Share Ride
          </Link>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  featured,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md transition-all ${
        featured
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card/50 hover:border-primary/30"
      }`}
    >
      {featured && (
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-30 blur-2xl"
          style={{ background: "var(--gradient-primary)" }}
        />
      )}
      <div className="relative flex items-center gap-1.5 text-muted-foreground">
        <span className={featured ? "text-primary" : ""}>{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="relative mt-3 font-display text-3xl font-light tracking-tight tabular-nums">
        {value}
        {unit && (
          <span className="ml-1.5 text-xs font-normal uppercase tracking-wider text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
