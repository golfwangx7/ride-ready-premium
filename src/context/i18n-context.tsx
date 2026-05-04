import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { LOCALES, BASE_DICT, type Lang, type TranslationKey } from "@/locales";

export type { Lang, TranslationKey };

// Backwards-compatible export used by settings screen.
export const LANG_OPTIONS: { code: Lang; label: string }[] = LOCALES.map((l) => ({
  code: l.code,
  label: l.label,
}));

const STORAGE_KEY = "ride.lang";

const LOCALE_MAP = Object.fromEntries(LOCALES.map((l) => [l.code, l.dict])) as Record<Lang, typeof BASE_DICT>;
const VALID = new Set<string>(LOCALES.map((l) => l.code));

type TFn = (key: TranslationKey | string, vars?: Record<string, string | number>) => string;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
  locales: typeof LANG_OPTIONS;
};

const I18nContext = createContext<Ctx | null>(null);

function detectInitial(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID.has(saved)) return saved as Lang;
    const legacy = LOCALES.find((o) => o.label === saved);
    if (legacy) return legacy.code;
    const nav = navigator.language?.slice(0, 2);
    if (nav && VALID.has(nav)) return nav as Lang;
  } catch {
    /* ignore */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(detectInitial());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* */ }
  }, []);

  const t = useCallback<TFn>((key, vars) => {
    const dict = LOCALE_MAP[lang] ?? BASE_DICT;
    let str = (dict as Record<string, string>)[key as string]
      ?? (BASE_DICT as Record<string, string>)[key as string]
      ?? (key as string);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t, locales: LANG_OPTIONS }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
