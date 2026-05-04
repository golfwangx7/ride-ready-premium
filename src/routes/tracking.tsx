import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import mapLive from "@/assets/map-live.jpg";

export const Route = createFileRoute("/tracking")({
  component: Tracking,
});

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

function Tracking() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(64);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      setSpeed((v) => Math.max(0, Math.min(180, v + (Math.random() - 0.5) * 6)));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="dark relative h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Map */}
      <img
        src={mapLive}
        alt="Live route map"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.14_0.012_250/0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* Pulsing position dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-6 animate-ping rounded-full bg-primary/30" />
        <span className="absolute inset-0 -m-3 rounded-full bg-primary/40 blur-md" />
        <span className="relative block h-4 w-4 rounded-full border-2 border-background bg-primary shadow-[0_0_24px_oklch(0.82_0.16_200/0.8)]" />
      </div>

      {/* Top overlay */}
      <header className="animate-fade-up absolute inset-x-0 top-0 z-10 px-6 pt-12">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Elapsed
            </p>
            <p className="mt-1 font-display text-3xl font-light tracking-tight tabular-nums">
              {formatTime(seconds)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Speed
            </p>
            <p className="mt-1 font-display text-base font-medium tabular-nums text-muted-foreground">
              {Math.round(speed)}
              <span className="ml-1 text-[10px] uppercase tracking-wider">km/h</span>
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              {running && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${running ? "bg-primary" : "bg-muted-foreground"}`} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {running ? "Recording" : "Paused"}
            </span>
          </div>
        </div>
      </header>

      {/* Bottom controls */}
      <footer className="animate-fade-up absolute inset-x-0 bottom-0 z-10 px-6 pb-10">
        <div className="mx-auto flex max-w-md items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Resume"}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-border bg-card/70 text-foreground backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-primary/40 active:scale-95 shadow-[var(--shadow-elegant)]"
          >
            {running ? (
              <Pause className="h-7 w-7 fill-current" strokeWidth={0} />
            ) : (
              <Play className="h-7 w-7 fill-current" strokeWidth={0} />
            )}
            <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {running ? "Pause" : "Resume"}
            </span>
          </button>

          <Link
            to="/"
            aria-label="Stop ride"
            className="group relative flex h-24 w-24 flex-col items-center justify-center rounded-full text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Square className="h-8 w-8 fill-current" strokeWidth={0} />
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em]">Stop</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
