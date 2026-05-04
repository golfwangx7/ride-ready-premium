import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bike, Car, Check, RotateCcw, Star, AlertTriangle, Trash2 } from "lucide-react";
import { useVehicles, formatDistance } from "@/context/vehicle-context";

export const Route = createFileRoute("/vehicle/$vehicleId")({
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicleId } = Route.useParams();
  const { getById, activeId, setActive, resetStats, removeVehicle } = useVehicles();
  const navigate = useNavigate();
  const vehicle = getById(vehicleId);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!vehicle) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Vehicle not found</p>
          <Link to="/profile" className="mt-3 inline-block text-sm text-primary">Back to garage</Link>
        </div>
      </div>
    );
  }

  const Icon = vehicle.type === "car" ? Car : Bike;
  const isActive = activeId === vehicle.id;

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto w-full max-w-md px-6 pb-16 pt-6">
        {/* Top bar */}
        <header className="animate-fade-up flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {isActive && (
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              <Star className="h-3 w-3 fill-primary" /> Active
            </span>
          )}
        </header>

        {/* Hero image */}
        <section
          className="animate-fade-up relative mt-6 overflow-hidden rounded-3xl border border-border"
          style={{ animationDelay: "60ms" }}
        >
          <img
            src={vehicle.image}
            alt={vehicle.name}
            width={1200}
            height={800}
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-primary">
              <Icon className="h-3 w-3" />
              {vehicle.type === "car" ? "Car" : "Motorcycle"}
            </div>
            <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight">{vehicle.name}</h1>
            <p className="text-xs text-muted-foreground">{vehicle.sub}</p>
          </div>
        </section>

        {/* Stats */}
        <section
          className="animate-fade-up mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-border backdrop-blur-md"
          style={{ background: "var(--gradient-surface)", animationDelay: "120ms" }}
        >
          <Stat value={String(vehicle.rides)} label="Total rides" />
          <Stat value={formatDistance(vehicle.distance)} label="Total distance" divided />
        </section>

        {/* Actions */}
        <section className="animate-fade-up mt-5 space-y-2.5" style={{ animationDelay: "180ms" }}>
          <button
            onClick={() => setActive(vehicle.id)}
            disabled={isActive}
            className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${
              isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card/40 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${
                isActive ? "bg-primary/20" : "bg-primary/10"
              }`}>
                <Star className={`h-4 w-4 ${isActive ? "fill-primary text-primary" : "text-primary"}`} />
              </span>
              <div>
                <p className="text-sm font-medium">{isActive ? "Active vehicle" : "Set as active vehicle"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {isActive ? "Used for new rides" : "Track new rides with this vehicle"}
                </p>
              </div>
            </div>
            {isActive && <Check className="h-4 w-4 text-primary" />}
          </button>

          <button
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card/40 px-5 py-4 text-left transition-all hover:border-destructive/50 hover:bg-destructive/5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <RotateCcw className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Reset stats</p>
                <p className="text-[11px] text-muted-foreground">Clear rides and distance</p>
              </div>
            </div>
          </button>
        </section>

        {/* Danger zone */}
        <section className="animate-fade-up mt-8" style={{ animationDelay: "240ms" }}>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm font-medium text-destructive transition-all hover:bg-destructive/10 active:scale-[0.99]"
          >
            <Trash2 className="h-4 w-4" />
            Delete vehicle
          </button>
        </section>
      </main>

      {confirmReset && (
        <ConfirmDialog
          title="Are you sure?"
          message="This cannot be undone. All rides and distance for this vehicle will be reset to zero."
          confirmLabel="Reset stats"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetStats(vehicle.id);
            setConfirmReset(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Are you sure you want to delete this vehicle?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            removeVehicle(vehicle.id);
            setConfirmDelete(false);
            navigate({ to: "/profile" });
          }}
        />
      )}
    </div>
  );
}

function Stat({ value, label, divided }: { value: string; label: string; divided?: boolean }) {
  return (
    <div className={`flex flex-col items-center py-6 ${divided ? "border-l border-border" : ""}`}>
      <p className="font-display text-2xl font-light tabular-nums">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
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
            <h2 className="font-display text-lg font-medium">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
