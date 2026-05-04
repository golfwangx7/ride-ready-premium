import { useEffect, useRef, useState } from "react";
import { Bike, Car, Check, X } from "lucide-react";
import { useVehicles, type VehicleType } from "@/context/vehicle-context";

const COLORS = [
  { name: "Black", hex: "#0b0b0d" },
  { name: "White", hex: "#f4f4f5" },
  { name: "Silver", hex: "#9ca3af" },
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Yellow", hex: "#eab308" },
];

export function AddVehicleDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addVehicle } = useVehicles();
  const [name, setName] = useState("");
  const [type, setType] = useState<VehicleType>("car");
  const [color, setColor] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setType("car");
      setColor("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    if (trimmed.length > 40) {
      setError("Name is too long");
      return;
    }
    addVehicle({ name: trimmed, type, color: color || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-background/70 backdrop-blur-md"
      />
      <form
        onSubmit={handleSave}
        className="animate-fade-up relative w-full max-w-md rounded-t-3xl border border-border bg-card/90 p-6 backdrop-blur-2xl sm:rounded-3xl"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />

        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-medium">Add vehicle</h2>
            <p className="mt-1 text-xs text-muted-foreground">A new ride for your garage</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Name */}
        <label className="mt-6 block">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Name</span>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="e.g. BMW M4, Yamaha R1"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
        </label>

        {/* Type */}
        <div className="mt-5">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Type</span>
          <div className="grid grid-cols-2 gap-2">
            <TypeOption label="Car" icon={<Car className="h-4 w-4" />} active={type === "car"} onClick={() => setType("car")} />
            <TypeOption label="Motorcycle" icon={<Bike className="h-4 w-4" />} active={type === "moto"} onClick={() => setType("moto")} />
          </div>
        </div>

        {/* Color */}
        <div className="mt-5">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Color <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">· optional</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(color === c.name ? "" : c.name)}
                aria-label={c.name}
                className={`relative h-8 w-8 rounded-full border transition-all ${
                  color === c.name
                    ? "border-primary scale-110 shadow-[0_0_0_2px_oklch(0.82_0.16_200/0.25)]"
                    : "border-border hover:scale-105"
                }`}
                style={{ background: c.hex }}
              >
                {color === c.name && (
                  <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-xs text-destructive">{error}</p>}

        {/* Actions */}
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="relative flex-1 rounded-full py-3 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function TypeOption({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
        active
          ? "border-primary/40 bg-primary/10 text-primary shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.25)]"
          : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
