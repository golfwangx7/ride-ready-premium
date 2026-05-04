import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Share2, MapPin } from "lucide-react";
import mapSummary from "@/assets/map-summary.jpg";
import { useMode } from "@/context/mode-context";

export const Route = createFileRoute("/share")({
  component: SharePage,
});

function SharePage() {
  const { mode } = useMode();
  const vehicle = mode === "moto" ? "Yamaha R1" : "BMW M4 Competition";

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-6 pt-12">
        <Link
          to="/summary"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Share card
        </p>
        <div className="h-10 w-10" />
      </header>

      <main className="relative mx-auto w-full max-w-md px-6 pt-8 pb-32">
        {/* Story-format share card (9:16) */}
        <div
          className="animate-fade-up relative mx-auto w-full overflow-hidden rounded-[2rem] border border-border"
          style={{
            aspectRatio: "9 / 16",
            background:
              "linear-gradient(180deg, oklch(0.16 0.014 250) 0%, oklch(0.13 0.012 250) 100%)",
            boxShadow: "var(--shadow-elegant), var(--shadow-glow)",
          }}
        >
          {/* Ambient glows */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-60 w-60 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />

          {/* Card content */}
          <div className="relative flex h-full flex-col p-7">
            {/* Top */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)]" />
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary">
                  Ride Recap
                </p>
              </div>
              <h1 className="mt-4 font-display text-[2.4rem] font-light leading-[1.05] tracking-tight">
                Sunday <span className="font-medium italic text-primary">Ride</span>
              </h1>
              <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Sun · 04 May · 09:14 AM
              </p>
            </div>

            {/* Map */}
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-border">
              <img
                src={mapSummary}
                alt="Route"
                width={1280}
                height={1024}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2.5 text-[9px] uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-2.5 w-2.5 text-primary" />
                  Twin Peaks
                </span>
                <span className="flex-1 mx-2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <span className="text-muted-foreground">Half Moon Bay</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
              <ShareStat label="Distance" value="84.2" unit="km" />
              <ShareStat label="Duration" value="1:42" unit="h" />
              <ShareStat label="Avg Speed" value="49" unit="km/h" />
              <ShareStat label="Stops" value="3" unit="" />
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                    Vehicle
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold tracking-tight">
                    {vehicle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-right">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    A
                  </span>
                  <div>
                    <p className="font-display text-[11px] font-semibold leading-none">apex</p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                      ride·log
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Action bar */}
      <footer className="fixed inset-x-0 bottom-0 z-20 px-6 pb-6 pt-10 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            aria-label="Download"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur-2xl transition-all hover:scale-105 hover:border-primary/40 active:scale-95"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Share2 className="h-4 w-4" />
            Share to Story
          </button>
        </div>
      </footer>
    </div>
  );
}

function ShareStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-light leading-none tracking-tight tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
