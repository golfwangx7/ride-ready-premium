import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, ImageIcon, X, Check } from "lucide-react";

const STORAGE_KEY = "profile.avatar";

export function useAvatar(defaultSrc: string) {
  const [src, setSrc] = useState<string>(defaultSrc);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSrc(saved);
    } catch {}
  }, []);
  const update = useCallback((next: string) => {
    setSrc(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);
  return { src, setSrc: update };
}

type Mode = "closed" | "sheet" | "crop";

export function AvatarPicker({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("closed");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMode(open ? "sheet" : "closed");
    if (!open) {
      setImageSrc(null);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [open]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setMode("crop");
    };
    reader.readAsDataURL(file);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.x),
      y: dragRef.current.oy + (e.clientY - dragRef.current.y),
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const handleConfirm = () => {
    if (!imgRef.current || !imageSrc) return;
    const SIZE = 512;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    // Crop area is a 280px circle on screen; compute scale from natural to display.
    const display = 280;
    const natural = Math.min(img.naturalWidth, img.naturalHeight);
    const baseScale = display / natural; // base "cover" scale (object-fit contain-ish)
    // We used object-cover style: rendered size fills the 280 box. Recompute properly:
    const renderedW = img.naturalWidth >= img.naturalHeight
      ? (img.naturalWidth / img.naturalHeight) * display
      : display;
    const renderedH = img.naturalHeight > img.naturalWidth
      ? (img.naturalHeight / img.naturalWidth) * display
      : display;

    const scaledW = renderedW * zoom;
    const scaledH = renderedH * zoom;

    // Center of display box
    const cx = display / 2 + offset.x;
    const cy = display / 2 + offset.y;
    // Top-left of scaled image in display coords
    const left = cx - scaledW / 2;
    const top = cy - scaledH / 2;

    // Source rect on natural image
    const naturalPerDisplay = img.naturalWidth / scaledW; // = naturalH/scaledH
    const sx = (0 - left) * naturalPerDisplay;
    const sy = (0 - top) * naturalPerDisplay;
    const sSize = display * naturalPerDisplay;

    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, SIZE, SIZE);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    onSave(dataUrl);
    onClose();
    void baseScale;
  };

  if (mode === "closed") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-md animate-fade-in"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {mode === "sheet" && (
        <div className="animate-fade-up relative w-full max-w-md rounded-t-3xl border border-border bg-card/90 p-6 backdrop-blur-2xl sm:rounded-3xl">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
          <h2 className="font-display text-lg font-medium">Profile photo</h2>
          <p className="mt-1 text-xs text-muted-foreground">Choose how to update your picture</p>

          <div className="mt-5 space-y-2">
            <SheetButton
              icon={<Camera className="h-4 w-4" />}
              label="Take photo"
              onClick={() => cameraInputRef.current?.click()}
            />
            <SheetButton
              icon={<ImageIcon className="h-4 w-4" />}
              label="Choose from gallery"
              onClick={() => galleryInputRef.current?.click()}
            />
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full rounded-full border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {mode === "crop" && imageSrc && (
        <div className="animate-fade-up relative flex w-full max-w-md flex-col items-center rounded-t-3xl border border-border bg-card/90 p-6 backdrop-blur-2xl sm:rounded-3xl">
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() => setMode("sheet")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Back"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="font-display text-base font-medium">Adjust</h2>
            <button
              onClick={handleConfirm}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow-sm)] transition-transform hover:scale-105"
              aria-label="Confirm"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>

          <div
            className="relative mt-6 h-[280px] w-[280px] touch-none select-none overflow-hidden rounded-full border border-border bg-background"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
              style={{
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-primary/40" />
          </div>

          <div className="mt-5 flex w-full items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-1 flex-1 cursor-pointer accent-primary"
            />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Drag to reposition</p>
        </div>
      )}
    </div>
  );
}

function SheetButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 py-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
