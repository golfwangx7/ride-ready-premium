import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, Car, MapPin, Heart, Home, Newspaper, User, Wind, Route as RouteIcon, Clock, Globe } from "lucide-react";
import feed1 from "@/assets/feed-1.jpg";
import feed2 from "@/assets/feed-2.jpg";
import feed3 from "@/assets/feed-3.jpg";
import avatar from "@/assets/avatar.jpg";
import { ModeToggle } from "@/components/mode-toggle";
import { useMode } from "@/context/mode-context";

export const Route = createFileRoute("/feed")({
  component: Feed,
});

type Filter = "all" | "mode";

const posts = [
  {
    id: 1,
    title: "Tail of the Dragon",
    user: "alex.rides",
    initial: "A",
    avatar,
    distance: "84 km",
    duration: "1h 42m",
    speed: "72 km/h",
    likes: 248,
    type: "moto" as const,
    location: "Deals Gap, NC",
    map: feed1,
  },
  {
    id: 2,
    title: "Pacific Coast Sunrise",
    user: "marina.k",
    initial: "M",
    avatar: null,
    distance: "126 km",
    duration: "2h 18m",
    speed: "65 km/h",
    likes: 412,
    type: "car" as const,
    location: "Big Sur, CA",
    map: feed2,
  },
  {
    id: 3,
    title: "Late Night City Loop",
    user: "kenji.t",
    initial: "K",
    avatar: null,
    distance: "32 km",
    duration: "48m",
    speed: "44 km/h",
    likes: 89,
    type: "car" as const,
    location: "Tokyo · Shibuya",
    map: feed3,
  },
];

function Feed() {
  const { mode } = useMode();
  const [filter, setFilter] = useState<Filter>("mode");
  const filtered = filter === "all" ? posts : posts.filter((p) => p.type === mode);

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto w-full max-w-md px-6 pb-32 pt-12">
        {/* Header */}
        <header className="animate-fade-up flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Discover</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">
              <span className="font-medium italic text-primary">Feed</span>
            </h1>
          </div>
          <ModeToggle size="sm" />
        </header>

        {/* Filters */}
        <section className="animate-fade-up mt-7 flex gap-2 overflow-x-auto pb-1" style={{ animationDelay: "80ms" }}>
          <FilterChip active={filter === "mode"} onClick={() => setFilter("mode")}>
            {mode === "moto" ? <Bike className="h-3.5 w-3.5" /> : <Car className="h-3.5 w-3.5" />}
            {mode === "moto" ? "Motorcycle" : "Car"}
          </FilterChip>
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            <Globe className="h-3.5 w-3.5" />
            All
          </FilterChip>
          <FilterChip active={false} onClick={() => {}}>
            <MapPin className="h-3.5 w-3.5" />
            Nearby
          </FilterChip>
        </section>

        {/* Posts */}
        <section className="mt-6 space-y-4">
          {filtered.map((p, i) => (
            <Post key={p.id} post={p} delay={160 + i * 80} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No rides yet — check back soon.</p>
          )}
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-2 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <NavBtn to="/" icon={<Home className="h-5 w-5" />} label="Home" />
          <NavBtn to="/feed" icon={<Newspaper className="h-5 w-5" />} label="Feed" active />
          <NavBtn to="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function FilterChip({
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
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
        active
          ? "border-primary/40 bg-primary/15 text-primary shadow-[var(--shadow-glow-sm)]"
          : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
      }`}
    >
      {children}
    </button>
  );
}

function Post({ post, delay }: { post: (typeof posts)[number]; delay: number }) {
  const [liked, setLiked] = useState(false);
  const Icon = post.type === "car" ? Car : Bike;
  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl border border-border backdrop-blur-md transition-all hover:border-primary/30"
      style={{ background: "var(--gradient-surface)", animationDelay: `${delay}ms` }}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={post.map}
          alt={`${post.title} route`}
          width={1024}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur-md">
          <Icon className="h-3 w-3 text-primary" />
          {post.type === "car" ? "Car" : "Moto"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold leading-tight">{post.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {post.location}
            </p>
          </div>
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="Like"
            className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/30"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`}
            />
            <span className={liked ? "text-primary tabular-nums" : "tabular-nums"}>
              {post.likes + (liked ? 1 : 0)}
            </span>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <RouteIcon className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{post.distance}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{post.duration}</span>
          </span>
          <span className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{post.speed}</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          {post.avatar ? (
            <img src={post.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
              {post.initial}
            </div>
          )}
          <span className="text-xs text-muted-foreground">@{post.user}</span>
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
