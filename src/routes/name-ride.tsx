import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Pencil } from "lucide-react";
import { useRide } from "@/context/ride-context";

export const Route = createFileRoute("/name-ride")({
  component: NameRide,
});

const SUGGESTIONS = [
  "Sunday Cruise",
  "Coast Run",
  "Canyon Carve",
  "Sunset Loop",
  "Morning Therapy",
];

function NameRide() {
  const { name, setName } = useRide();
  const [value, setValue] = useState(name === "Sunday Cruise" ? "" : name);
  const navigate = useNavigate();

  const submit = (override?: string) => {
    const final = (override ?? value).trim() || "Sunday Cruise";
    setName(final);
    navigate({ to: "/share" });
  };

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-6 pt-12">
        <Link
          to="/summary"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Step 1 of 2
        </p>
        <button
          onClick={() => submit("")}
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col px-6 pt-16">
        <section className="animate-fade-up">
          <div className="flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary">
              Name your ride
            </p>
          </div>
          <h1 className="mt-4 font-display text-[2.4rem] font-light leading-[1.05] tracking-tight">
            Make it <span className="font-medium italic text-primary">yours</span>.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Give this ride a title. A few words is all it takes.
          </p>
        </section>

        <section className="animate-fade-up mt-10" style={{ animationDelay: "100ms" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="group relative">
              <input
                autoFocus
                type="text"
                value={value}
                maxLength={40}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Name your ride (e.g. Sunday Cruise)"
                className="w-full rounded-2xl border border-border bg-card/60 px-5 py-5 font-display text-lg font-medium tracking-tight backdrop-blur-md outline-none transition-all placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:border-primary/50 focus:shadow-[var(--shadow-glow-sm)]"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                {value.length}/40
              </span>
            </div>
          </form>
        </section>

        <section className="animate-fade-up mt-6" style={{ animationDelay: "180ms" }}>
          <div className="mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Suggestions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue(s)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  value === s
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-10 pb-8">
          <button
            type="button"
            onClick={() => submit()}
            className="relative flex h-14 w-full items-center justify-center gap-2.5 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
