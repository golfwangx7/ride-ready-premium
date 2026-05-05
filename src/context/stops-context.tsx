import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type StopKind = "fuel" | "break" | "food" | "police" | "other";

export type RideStop = {
  id: string;
  kind: StopKind;
  note?: string;
};

type Ctx = {
  stops: RideStop[];
  addStop: (kind: StopKind, note?: string) => void;
  removeStop: (id: string) => void;
  reset: () => void;
};

const StopsContext = createContext<Ctx | null>(null);

export function StopsProvider({ children }: { children: ReactNode }) {
  const [stops, setStops] = useState<RideStop[]>([]);

  const addStop = useCallback((kind: StopKind, note?: string) => {
    setStops((s) => [...s, { id: crypto.randomUUID(), kind, note }]);
  }, []);

  const removeStop = useCallback((id: string) => {
    setStops((s) => s.filter((x) => x.id !== id));
  }, []);

  const reset = useCallback(() => setStops([]), []);

  return (
    <StopsContext.Provider value={{ stops, addStop, removeStop, reset }}>
      {children}
    </StopsContext.Provider>
  );
}

export function useStops() {
  const ctx = useContext(StopsContext);
  if (!ctx) throw new Error("useStops must be used within StopsProvider");
  return ctx;
}
