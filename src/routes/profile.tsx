import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Plus, Bike, Car, MapPin, ChevronRight, Home, Newspaper, User } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import carBmw from "@/assets/car-bmw.jpg";
import motoYamaha from "@/assets/moto-yamaha.jpg";
import { ModeToggle, modeStats } from "@/components/mode-toggle";
import { useMode } from "@/context/mode-context";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const vehicles = [
  {
    name: "BMW M4",
    sub: "Competition · 2023",
    type: "car" as const,
    rides: 42,
    distance: "3,210 km",
    image: carBmw,
  },
  {
    name: "Yamaha R1",
    sub: "Race Blu · 2022",
    type: "moto" as const,
    rides: 86,
    distance: "5,684 km",
    image: motoYamaha,
  },
];

function Profile() {
  const { mode } = useMode();
  const stats = modeStats(mode);
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-32 pt-12">
        {/* Top bar */}
        <header className="animate-fade-up flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40">
            <Settings className="h-4 w-4" />
          </button>
        </header>

        {/* Profile */}
        <section className="animate-fade-up mt-8 flex flex-col items-center text-center" style={{ animationDelay: "80ms" }}>
          <div className="relative">
            <div
              className="absolute inset-0 -m-1 rounded-full opacity-70 blur-md"
              style={{ background: "var(--gradient-primary)" }}
            />
            <img
              src={avatar}
              alt="Alex Carter"
              width={512}
              height={512}
              className="relative h-24 w-24 rounded-full border-2 border-background object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary shadow-[0_0_12px_oklch(0.82_0.16_200/0.8)]" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-medium tracking-tight">Alex Carter</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            San Francisco · @alex.rides
          </p>
        </section>

        {/* Mode toggle */}
        <section className="animate-fade-up mt-7" style={{ animationDelay: "120ms" }}>
          <ModeToggle />
        </section>

        {/* Stats */}
        <section className="animate-fade-up mt-5" style={{ animationDelay: "180ms" }}>
          <div
            key={mode}
            className="animate-fade-up grid grid-cols-3 overflow-hidden rounded-2xl border border-border backdrop-blur-md"
            style={{ background: "var(--gradient-surface)" }}
          >
            <Stat value={String(stats.rides)} label={mode === "moto" ? "Moto rides" : "Car rides"} />
            <Stat value={stats.distance} label="km" divided />
            <Stat value={String(stats.top)} label="Top km/h" divided highlight />
          </div>
        </section>

        {/* Garage */}
        <section className="animate-fade-up mt-9" style={{ animationDelay: "240ms" }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium">Garage</h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {vehicles.length} vehicles
              </p>
            </div>
            <button className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/15">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {vehicles.map((v, i) => (
              <VehicleCard key={v.name} vehicle={v} delay={300 + i * 80} />
            ))}

            {/* Add vehicle ghost card */}
            <button
              type="button"
              className="animate-fade-up group flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/30 py-5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              style={{ animationDelay: `${300 + vehicles.length * 80}ms` }}
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Add Vehicle
            </button>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-2 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <NavBtn to="/" icon={<Home className="h-5 w-5" />} label="Home" />
          <NavBtn to="/feed" icon={<Newspaper className="h-5 w-5" />} label="Feed" />
          <NavBtn to="/profile" icon={<User className="h-5 w-5" />} label="Profile" active />
        </div>
      </nav>
    </div>
  );
}

function Stat({
  value,
  label,
  divided,
  highlight,
}: {
  value: string;
  label: string;
  divided?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center py-5 ${divided ? "border-l border-border" : ""}`}>
      <p className={`font-display text-2xl font-light tabular-nums ${highlight ? "text-primary" : ""}`}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}

function VehicleCard({
  vehicle,
  delay,
}: {
  vehicle: (typeof vehicles)[number];
  delay: number;
}) {
  const Icon = vehicle.type === "car" ? Car : Bike;
  return (
    <article
      className="animate-fade-up group relative overflow-hidden rounded-2xl border border-border backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow-sm)]"
      style={{ background: "var(--gradient-surface)", animationDelay: `${delay}ms` }}
    >
      <div className="flex items-stretch">
        <div className="relative h-28 w-36 shrink-0 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            width={1024}
            height={512}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
              <Icon className="h-3 w-3" />
              {vehicle.type === "car" ? "Car" : "Motorcycle"}
            </div>
            <h3 className="mt-1.5 font-display text-base font-semibold leading-tight">
              {vehicle.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">{vehicle.sub}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-[11px] text-muted-foreground">
              <span><span className="text-foreground font-medium">{vehicle.rides}</span> rides</span>
              <span><span className="text-foreground font-medium">{vehicle.distance}</span></span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </article>
  );
}

function NavBtn({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
        active
          ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.3)]"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {active && <span>{label}</span>}
    </Link>
  );
}
