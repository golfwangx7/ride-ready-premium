import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Share2, Bookmark, ArrowLeft, Gauge, Route as RouteIcon, Clock, Wind, Flag, Car, Bike, Sparkles, ChevronRight, Plus, X, Fuel, Coffee, Utensils, Shield, MoreHorizontal } from "lucide-react";
import mapSummary from "@/assets/map-summary.jpg";
import { useRide, formatHoursMinutes, metersToKm, mpsToKmh } from "@/context/ride-context";
import { useVehicles } from "@/context/vehicle-context";
import { usePremium } from "@/context/premium-context";
import { useStops, type StopKind } from "@/context/stops-context";
import { MapboxMap, getMapboxToken } from "@/components/mapbox-map";

export const Route = createFileRoute("/summary")({
  component: Summary,
});

function Summary() {
  const { name, stats, points } = useRide();
  const { vehicles, activeId } = useVehicles();
  const { isPremium, openPaywall } = usePremium();
  const { stops, addStop, removeStop } = useStops();
  const active = vehicles.find((v) => v.id === activeId) ?? vehicles[0];
  const [first, ...rest] = name.split(" ");
  const hasRide = stats.duration > 0 || stats.distance > 0;
  const distanceKm = hasRide ? metersToKm(stats.distance).toFixed(1) : "84.2";
  const durationStr = hasRide ? formatHoursMinutes(stats.duration) : "1:42";
  const avgKmh = hasRide ? Math.round(mpsToKmh(stats.avgSpeed)) : 49;
  const maxKmh = hasRide ? Math.round(mpsToKmh(stats.maxSpeed)) : 142;

  const route = useMemo<Array<[number, number]>>(
    () => points.map((p) => [p.lng, p.lat]),
    [points],
  );
  const hasMapToken = !!getMapboxToken();
  const lastPoint = points[points.length - 1];
  const center = lastPoint ? ([lastPoint.lng, lastPoint.lat] as [number, number]) : undefined;
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
            className="group relative h-72 overflow-hidden rounded-3xl border border-border"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            {hasMapToken && route.length > 1 ? (
              <MapboxMap center={center} route={route} follow={false} className="absolute inset-0 h-full w-full" />
            ) : (
              <img
                src={mapSummary}
                alt="Ride route map"
                width={1280}
                height={1024}
                className="h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
          </div>
        </section>

        {/* Stats grid */}
        <section className="animate-fade-up mt-6 grid grid-cols-2 gap-3" style={{ animationDelay: "240ms" }}>
          <StatCard icon={<RouteIcon className="h-4 w-4" />} label="Distance" value={distanceKm} unit="km" featured />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Duration" value={durationStr} unit="h" />
          <StatCard icon={<Wind className="h-4 w-4" />} label="Avg Speed" value={String(avgKmh)} unit="km/h" />
          <StatCard icon={<Flag className="h-4 w-4" />} label="Stops" value={String(stops.length)} unit="" />
        </section>

        {/* Max speed strip */}
        <section className="animate-fade-up mt-3" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card/40 px-5 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.2em]">Max speed</span>
            </div>
            <p className="font-display text-base font-medium tabular-nums">
              {maxKmh}<span className="ml-1 text-[10px] uppercase tracking-wider text-muted-foreground">km/h</span>
            </p>
          </div>
        </section>

        {/* Stops editor */}
        <StopsEditor stops={stops} onAdd={addStop} onRemove={removeStop} />

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

        {/* Premium upsell — appears only for free users, after the rewarding summary */}
        {!isPremium && (
          <section className="animate-fade-up mt-5" style={{ animationDelay: "440ms" }}>
            <button
              type="button"
              onClick={() => openPaywall()}
              className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-primary/25 px-4 py-3.5 text-left backdrop-blur-md transition-[border-color,transform] hover:border-primary/50 active:scale-[0.99]"
              style={{ background: "var(--gradient-surface)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl"
                style={{ background: "var(--gradient-primary)" }}
              />
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Rydr Premium</p>
                <p className="mt-0.5 truncate text-[13px] font-medium">
                  Unlock advanced ride insights with Premium
                </p>
              </div>
              <span
                className="relative inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
              >
                Upgrade
                <ChevronRight className="h-3 w-3" />
              </span>
            </button>
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

const STOP_KINDS: { kind: StopKind; label: string; icon: React.ReactNode }[] = [
  { kind: "fuel", label: "Fuel", icon: <Fuel className="h-3.5 w-3.5" /> },
  { kind: "break", label: "Break", icon: <Coffee className="h-3.5 w-3.5" /> },
  { kind: "food", label: "Food", icon: <Utensils className="h-3.5 w-3.5" /> },
  { kind: "police", label: "Police", icon: <Shield className="h-3.5 w-3.5" /> },
  { kind: "other", label: "Other", icon: <MoreHorizontal className="h-3.5 w-3.5" /> },
];

function StopsEditor({
  stops,
  onAdd,
  onRemove,
}: {
  stops: { id: string; kind: StopKind; note?: string }[];
  onAdd: (kind: StopKind) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const counts = stops.reduce<Record<string, number>>((acc, s) => {
    acc[s.kind] = (acc[s.kind] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <section className="animate-fade-up mt-5" style={{ animationDelay: "360ms" }}>
      <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Ride stops</p>
            <p className="mt-0.5 font-display text-sm font-medium">
              {stops.length === 0 ? "No stops logged" : `${stops.length} stop${stops.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {open && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {STOP_KINDS.map((s) => (
              <button
                key={s.kind}
                type="button"
                onClick={() => onAdd(s.kind)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background/40 px-2 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        )}

        {stops.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {stops.map((s) => {
              const meta = STOP_KINDS.find((k) => k.kind === s.kind);
              return (
                <li key={s.id} className="flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-[12px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                    {meta?.icon}
                  </span>
                  <span className="flex-1 font-medium capitalize">{meta?.label ?? s.kind}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                    aria-label="Remove stop"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {Object.keys(counts).length > 0 && (
          <p className="mt-3 text-[10px] text-muted-foreground">
            {Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(" · ")}
          </p>
        )}
      </div>
    </section>
  );
}

