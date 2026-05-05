import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bike, Car, MapPin, Heart, Home, Newspaper, User, Wind, Route as RouteIcon, Clock, Globe, Loader2, AlertCircle } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import feed1 from "@/assets/feed-1.jpg";
import feed2 from "@/assets/feed-2.jpg";
import feed3 from "@/assets/feed-3.jpg";
import { ModeToggle } from "@/components/mode-toggle";
import { useMode } from "@/context/mode-context";
import { useI18n } from "@/context/i18n-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/feed")({
  component: Feed,
});

type Filter = "all" | "mode" | "nearby";

type FeedPost = {
  id: string;
  title: string;
  user_handle: string;
  user_initial: string;
  vehicle_type: "moto" | "car";
  location: string;
  lat: number;
  lng: number;
  distance_km: number;
  duration_minutes: number;
  avg_speed_kmh: number;
  likes: number;
  map_image?: string | null;
};

const FALLBACK_MAPS = [feed1, feed2, feed3];
const NEARBY_RADIUS_KM = 50; // a bit generous for a demo dataset

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Feed() {
  const { mode } = useMode();
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("mode");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [requestingGeo, setRequestingGeo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (!error && data) setPosts(data as FeedPost[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Location not supported on this device");
      return;
    }
    setRequestingGeo(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setRequestingGeo(false);
      },
      (err) => {
        setRequestingGeo(false);
        setGeoError(err.code === 1 ? "Location permission denied" : "Couldn't get location");
        setFilter("mode");
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 }
    );
  };

  const handleFilter = (f: Filter) => {
    setFilter(f);
    if (f === "nearby" && !userLoc) requestLocation();
  };

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    if (filter === "mode") return posts.filter((p) => p.vehicle_type === mode);
    if (filter === "nearby" && userLoc) {
      return posts
        .map((p) => ({ ...p, _d: haversineKm(userLoc.lat, userLoc.lng, p.lat, p.lng) }))
        .filter((p) => p._d <= NEARBY_RADIUS_KM)
        .sort((a, b) => a._d - b._d);
    }
    return [];
  }, [filter, posts, mode, userLoc]);

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
        <section className="animate-fade-up mt-7 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ animationDelay: "80ms" }}>
          <FilterChip active={filter === "mode"} onClick={() => handleFilter("mode")}>
            {mode === "moto" ? <Bike className="h-3.5 w-3.5" /> : <Car className="h-3.5 w-3.5" />}
            {mode === "moto" ? "Moto" : "Car"}
          </FilterChip>
          <FilterChip active={filter === "all"} onClick={() => handleFilter("all")}>
            <Globe className="h-3.5 w-3.5" />
            All
          </FilterChip>
          <FilterChip active={filter === "nearby"} onClick={() => handleFilter("nearby")}>
            {requestingGeo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
            Nearby
          </FilterChip>
        </section>

        {filter === "nearby" && geoError && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[12px] text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{geoError}</p>
              <p className="mt-0.5 text-[11px] text-destructive/80">
                Enable location in your device settings to see rides near you.
              </p>
            </div>
          </div>
        )}

        {/* Posts */}
        <section key={`${mode}-${filter}`} className="mt-6 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {!loading && filtered.map((p, i) => (
            <Post key={p.id} post={p} mapImage={FALLBACK_MAPS[i % FALLBACK_MAPS.length]} delay={160 + i * 60} />
          ))}
          {!loading && filtered.length === 0 && !geoError && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {filter === "nearby" ? "No rides within 50 km — try All or Moto/Car." : "No rides yet — check back soon."}
            </p>
          )}
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-2 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <NavBtn to="/" icon={<Home className="h-5 w-5" />} label={t("nav.home")} />
          <NavBtn to="/feed" icon={<Newspaper className="h-5 w-5" />} label={t("nav.feed")} active />
          <NavBtn to="/profile" icon={<User className="h-5 w-5" />} label={t("nav.profile")} />
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

function Post({ post, mapImage, delay }: { post: FeedPost; mapImage: string; delay: number }) {
  const [liked, setLiked] = useState(false);
  const Icon = post.vehicle_type === "car" ? Car : Bike;
  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl border border-border backdrop-blur-md transition-all hover:border-primary/30"
      style={{ background: "var(--gradient-surface)", animationDelay: `${delay}ms` }}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={post.map_image ?? mapImage}
          alt={`${post.title} route`}
          width={1024}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur-md">
          <Icon className="h-3 w-3 text-primary" />
          {post.vehicle_type === "car" ? "Car" : "Moto"}
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
            <Heart className={`h-3.5 w-3.5 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`} />
            <span className={liked ? "text-primary tabular-nums" : "tabular-nums"}>
              {post.likes + (liked ? 1 : 0)}
            </span>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <RouteIcon className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{post.distance_km} km</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{formatDuration(post.duration_minutes)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span className="font-medium text-foreground tabular-nums">{post.avg_speed_kmh} km/h</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
            {post.user_initial}
          </div>
          <span className="text-xs text-muted-foreground">@{post.user_handle}</span>
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

// avatar import is referenced via fallback assets only; keep tree-shake quiet
void avatar;
