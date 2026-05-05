import { Check, X, Globe } from "lucide-react";
import { useEffect } from "react";
import { LANG_OPTIONS, useI18n, type Lang } from "@/context/i18n-context";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LanguagePicker({ open, onClose }: Props) {
  const { lang, setLang } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-background/80 backdrop-blur-md"
      />
      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Language</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Choose your preferred language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <ul className="mt-5 max-h-[60vh] space-y-1.5 overflow-y-auto">
          {LANG_OPTIONS.map((opt) => {
            const active = opt.code === lang;
            return (
              <li key={opt.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(opt.code as Lang);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-background/40 hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold uppercase ${
                      active ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {opt.code}
                  </span>
                  <span className={`flex-1 text-sm font-medium ${active ? "text-foreground" : "text-foreground"}`}>
                    {opt.label}
                  </span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
