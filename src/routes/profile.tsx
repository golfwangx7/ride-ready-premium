import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Settings, Plus, Bike, Car, MapPin, ChevronRight, Home, Newspaper, User, Star, Trash2, AlertTriangle } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import { ModeToggle, modeStats } from "@/components/mode-toggle";
import { useMode } from "@/context/mode-context";
import { SocialLinks, SocialEditor, useSocials } from "@/components/socials";
import { AvatarPicker, useAvatar } from "@/components/avatar-picker";
import { Camera } from "lucide-react";
import { useVehicles, formatDistance, type Vehicle } from "@/context/vehicle-context";
import { useProfile } from "@/context/profile-context";
import { AddVehicleDialog } from "@/components/add-vehicle-dialog";
import { useI18n } from "@/context/i18n-context";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { mode } = useMode();
  const stats = modeStats(mode);
  const { socials, setSocials } = useSocials();
  const [editing, setEditing] = useState(false);
  const { src: avatarSrc, setSrc: setAvatarSrc } = useAvatar(avatar);
  const [pickingAvatar, setPickingAvatar] = useState(false);
  const { vehicles, activeId, removeVehicle } = useVehicles();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pendingDelete = vehicles.find((v) => v.id === confirmDeleteId);
  const { profile } = useProfile();
  const [addingVehicle, setAddingVehicle] = useState(false);
  const { t } = useI18n();
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
          <Link
            to="/settings"
            aria-label="Settings"
            onClick={() => {
              if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                try { navigator.vibrate(10); } catch { /* ignore */ }
              }
            }}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:bg-card/80 active:scale-90"
          >
            <Settings className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-45 group-active:rotate-90" />
          </Link>
        </header>

        {/* Profile */}
        <section className="animate-fade-up mt-8 flex flex-col items-center text-center" style={{ animationDelay: "80ms" }}>
          <button
            type="button"
            onClick={() => setPickingAvatar(true)}
            className="group relative outline-none"
            aria-label="Change profile picture"
          >
            <div
              className="absolute inset-0 -m-1 rounded-full opacity-70 blur-md transition-opacity group-hover:opacity-100"
              style={{ background: "var(--gradient-primary)" }}
            />
            <img
              src={avatarSrc}
              alt={profile.name}
              width={512}
              height={512}
              className="relative h-24 w-24 rounded-full border-2 border-background object-cover transition-transform group-hover:scale-[1.02]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.82_0.16_200/0.8)] transition-transform group-hover:scale-110">
              <Camera className="h-3.5 w-3.5" />
            </span>
          </button>
          <h1 className="mt-5 font-display text-2xl font-medium tracking-tight">{profile.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {profile.location} · @{profile.username}
          </p>
          <SocialLinks socials={socials} onEdit={() => setEditing(true)} />
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
              <h2 className="font-display text-lg font-medium">{t("profile.garage")}</h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {vehicles.length} {t("profile.vehicles")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddingVehicle(true)}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/15 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("profile.add")}
            </button>
          </div>

          <div className="space-y-3">
            {vehicles.length === 0 ? (
              <div
                className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 px-6 py-12 text-center backdrop-blur-md"
                style={{ animationDelay: "300ms" }}
              >
                <div className="relative mb-5">
                  <div
                    className="absolute inset-0 -m-2 rounded-full opacity-40 blur-xl"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                    <Car className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    <Bike className="absolute h-5 w-5 translate-x-3 translate-y-3 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-display text-base font-medium">{t("profile.empty_title")}</h3>
                <p className="mt-1.5 max-w-[240px] text-[12px] leading-relaxed text-muted-foreground">
                  {t("profile.empty_subtitle")}
                </p>
                <button
                  type="button"
                  onClick={() => setAddingVehicle(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow-sm)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  {t("profile.add_vehicle")}
                </button>
              </div>
            ) : (
              <>
                {vehicles.map((v, i) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    delay={300 + i * 80}
                    active={v.id === activeId}
                    onRequestDelete={() => setConfirmDeleteId(v.id)}
                  />
                ))}

                {/* Add vehicle ghost card */}
                <button
                  type="button"
                  onClick={() => setAddingVehicle(true)}
                  className="animate-fade-up group flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/30 py-5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.99]"
                  style={{ animationDelay: `${300 + vehicles.length * 80}ms` }}
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  {t("profile.add_vehicle")}
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-2 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
          <NavBtn to="/" icon={<Home className="h-5 w-5" />} label={t("nav.home")} />
          <NavBtn to="/feed" icon={<Newspaper className="h-5 w-5" />} label={t("nav.feed")} />
          <NavBtn to="/profile" icon={<User className="h-5 w-5" />} label={t("nav.profile")} active />
        </div>
      </nav>

      <SocialEditor
        open={editing}
        initial={socials}
        onClose={() => setEditing(false)}
        onSave={setSocials}
      />

      <AvatarPicker
        open={pickingAvatar}
        onClose={() => setPickingAvatar(false)}
        onSave={setAvatarSrc}
      />

      <AddVehicleDialog open={addingVehicle} onClose={() => setAddingVehicle(false)} />

      {pendingDelete && (
        <DeleteVehicleDialog
          name={pendingDelete.name}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            removeVehicle(pendingDelete.id);
            setConfirmDeleteId(null);
          }}
        />
      )}
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

const SWIPE_REVEAL = 88; // px width of delete action
const SWIPE_THRESHOLD = 40;

function VehicleCard({
  vehicle,
  delay,
  active,
  onRequestDelete,
}: {
  vehicle: Vehicle;
  delay: number;
  active?: boolean;
  onRequestDelete: () => void;
}) {
  const Icon = vehicle.type === "car" ? Car : Bike;
  const [offset, setOffset] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    dragging.current = true;
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!moved.current) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // If predominantly vertical, abandon swipe so the page can scroll
      if (Math.abs(dy) > Math.abs(dx)) {
        dragging.current = false;
        return;
      }
      moved.current = true;
      try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch { /* */ }
    }
    const base = revealed ? -SWIPE_REVEAL : 0;
    const next = Math.min(0, Math.max(-SWIPE_REVEAL - 20, base + dx));
    setOffset(next);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (!moved.current) return;
    const shouldReveal = offset < -SWIPE_THRESHOLD;
    setRevealed(shouldReveal);
    setOffset(shouldReveal ? -SWIPE_REVEAL : 0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (moved.current || revealed) {
      e.preventDefault();
      e.stopPropagation();
      if (revealed) {
        setRevealed(false);
        setOffset(0);
      }
    }
  };

  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Delete action behind card */}
      <button
        type="button"
        aria-label={`Delete ${vehicle.name}`}
        onClick={() => { setRevealed(false); setOffset(0); onRequestDelete(); }}
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-destructive text-destructive-foreground transition-opacity"
        style={{ opacity: offset < -8 ? 1 : 0 }}
      >
        <div className="flex flex-col items-center gap-1">
          <Trash2 className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Delete</span>
        </div>
      </button>

      <Link
        to="/vehicle/$vehicleId"
        params={{ vehicleId: vehicle.id }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={handleClick}
        className="group relative block touch-pan-y select-none overflow-hidden rounded-2xl border border-border backdrop-blur-md transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-[var(--shadow-glow-sm)]"
        style={{
          background: "var(--gradient-surface)",
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? "none" : "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex items-stretch">
          <div
            className="relative h-28 w-36 shrink-0 overflow-hidden"
            style={vehicle.custom ? { background: "var(--gradient-surface)" } : undefined}
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              width={1024}
              height={512}
              loading="lazy"
              draggable={false}
              className={`h-full w-full transition-transform duration-700 group-hover:scale-110 ${
                vehicle.custom ? "object-contain p-2" : "object-cover"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
                <Icon className="h-3 w-3" />
                {vehicle.type === "car" ? "Car" : "Motorcycle"}
                {active && (
                  <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px]">
                    <Star className="h-2.5 w-2.5 fill-primary" /> Active
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold leading-tight">
                {vehicle.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">{vehicle.sub}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-[11px] text-muted-foreground">
                <span><span className="text-foreground font-medium">{vehicle.rides}</span> rides</span>
                <span><span className="text-foreground font-medium">{formatDistance(vehicle.distance)}</span></span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function DeleteVehicleDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 animate-fade-in bg-background/70 backdrop-blur-md"
      />
      <div className="animate-fade-up relative w-full max-w-md rounded-t-3xl border border-border bg-card/90 p-6 backdrop-blur-2xl sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-lg font-medium">Delete {name}?</h2>
            <p className="mt-1 text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-destructive py-3 text-sm font-medium text-destructive-foreground transition-transform hover:scale-[1.02]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
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
