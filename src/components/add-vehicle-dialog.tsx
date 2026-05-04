import { useEffect, useRef, useState } from "react";
import { Bike, Camera, Car, Check, Lock, Sparkles, X, Loader2 } from "lucide-react";
import { useVehicles, type VehicleType } from "@/context/vehicle-context";
import { usePremium } from "@/context/premium-context";
import { processVehicleImage } from "@/lib/image-processing";

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
  const { isPremium, openPaywall } = usePremium();
  const [name, setName] = useState("");
  const [type, setType] = useState<VehicleType>("car");
  const [color, setColor] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setType("car");
      setColor("");
      setImage(null);
      setProcessing(false);
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
    addVehicle({ name: trimmed, type, color: color || undefined, image: image || undefined });
    onClose();
  };

  const handlePhotoSlotClick = () => {
    if (!isPremium) {
      openPaywall();
      return;
    }
    fileRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setError(null);
    setProcessing(true);
    try {
      const dataUrl = await processVehicleImage(file);
      setImage(dataUrl);
    } catch (err) {
      console.error(err);
      setError("Could not process image. Please try another photo.");
    } finally {
      setProcessing(false);
    }
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

        {/* Photo slot */}
        <div className="mt-6">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Photo {!isPremium && <span className="ml-1 normal-case tracking-normal text-primary/80">· Premium</span>}
          </span>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={handlePhotoSlotClick}
            disabled={processing}
            className={`group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border transition-all ${
              image
                ? "border-primary/40"
                : "border-dashed border-border hover:border-primary/40 bg-background/40"
            }`}
            style={image ? { background: "var(--gradient-surface)" } : undefined}
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt="Vehicle"
                  className="h-full w-full object-contain p-2"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] backdrop-blur-md">
                  <Camera className="h-3 w-3" /> Replace
                </span>
              </>
            ) : processing ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-[11px]">Removing background…</span>
              </div>
            ) : isPremium ? (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <Camera className="h-5 w-5" />
                <span className="text-xs">Add a photo</span>
                <span className="text-[10px]">Background removed automatically</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium">Add your vehicle photo</span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="h-3 w-3" /> Premium
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Name */}
        <label className="mt-5 block">
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
            disabled={processing}
            className="relative flex-1 rounded-full py-3 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
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
