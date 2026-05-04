import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "moto" | "car";

type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

const ModeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "ride.mode";

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("moto");

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "car" || saved === "moto") setModeState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle: () => setMode(mode === "moto" ? "car" : "moto") }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
