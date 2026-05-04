import { useEffect, useState } from "react";
import { Instagram, X, Check } from "lucide-react";

const STORAGE_KEY = "ride.socials";

type Socials = { instagram: string; tiktok: string };

function load(): Socials {
  if (typeof localStorage === "undefined") return { instagram: "", tiktok: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { instagram: "", tiktok: "" };
    const parsed = JSON.parse(raw);
    return { instagram: parsed.instagram ?? "", tiktok: parsed.tiktok ?? "" };
  } catch {
    return { instagram: "", tiktok: "" };
  }
}

function clean(handle: string) {
  return handle.trim().replace(/^@+/, "").replace(/\s+/g, "");
}

export function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.59a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84Z" />
    </svg>
  );
}

export function useSocials() {
  const [socials, setSocialsState] = useState<Socials>({ instagram: "", tiktok: "" });

  useEffect(() => {
    setSocialsState(load());
  }, []);

  const setSocials = (next: Socials) => {
    const cleaned = { instagram: clean(next.instagram), tiktok: clean(next.tiktok) };
    setSocialsState(cleaned);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch {
      // ignore
    }
  };

  return { socials, setSocials };
}

export function SocialLinks({
  socials,
  onEdit,
}: {
  socials: Socials;
  onEdit: () => void;
}) {
  const has = socials.instagram || socials.tiktok;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {socials.instagram && (
        <a
          href={`https://instagram.com/${socials.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram @${socials.instagram}`}
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-md transition-all hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
        >
          <Instagram className="h-4 w-4" />
        </a>
      )}
      {socials.tiktok && (
        <a
          href={`https://tiktok.com/@${socials.tiktok}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`TikTok @${socials.tiktok}`}
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-md transition-all hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
        >
          <TikTokIcon />
        </a>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="flex h-9 items-center gap-1.5 rounded-full border border-dashed border-border bg-card/30 px-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
      >
        {has ? "Edit" : "+ Link socials"}
      </button>
    </div>
  );
}

export function SocialEditor({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: Socials;
  onClose: () => void;
  onSave: (s: Socials) => void;
}) {
  const [ig, setIg] = useState(initial.instagram);
  const [tt, setTt] = useState(initial.tiktok);

  useEffect(() => {
    if (open) {
      setIg(initial.instagram);
      setTt(initial.tiktok);
    }
  }, [open, initial.instagram, initial.tiktok]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-up absolute inset-0 bg-background/70 backdrop-blur-md"
      />
      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Link your socials</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Show your handles on your profile. Tap-to-open.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ instagram: ig, tiktok: tt });
            onClose();
          }}
          className="mt-6 space-y-4"
        >
          <Field
            icon={<Instagram className="h-4 w-4" />}
            label="Instagram"
            placeholder="username"
            value={ig}
            onChange={setIg}
          />
          <Field
            icon={<TikTokIcon />}
            label="TikTok"
            placeholder="username"
            value={tt}
            onChange={setTt}
          />

          <button
            type="submit"
            className="relative mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Check className="h-4 w-4" strokeWidth={3} />
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-border bg-background/60 px-3 transition-colors focus-within:border-primary/50">
        <span className="text-sm text-muted-foreground">@</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent py-3 pl-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}
