import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import carBmw from "@/assets/car-bmw.jpg";
import motoYamaha from "@/assets/moto-yamaha.jpg";

export type VehicleType = "car" | "moto";

export type Vehicle = {
  id: string;
  name: string;
  sub: string;
  type: VehicleType;
  rides: number;
  distance: number; // km
  image: string;
};

const DEFAULTS: Vehicle[] = [
  { id: "bmw-m4", name: "BMW M4", sub: "Competition · 2023", type: "car", rides: 42, distance: 3210, image: carBmw },
  { id: "yamaha-r1", name: "Yamaha R1", sub: "Race Blu · 2022", type: "moto", rides: 86, distance: 5684, image: motoYamaha },
];

const STORAGE_KEY = "garage.vehicles";
const ACTIVE_KEY = "garage.active";

type Ctx = {
  vehicles: Vehicle[];
  activeId: string;
  setActive: (id: string) => void;
  resetStats: (id: string) => void;
  getById: (id: string) => Vehicle | undefined;
};

const VehicleContext = createContext<Ctx | null>(null);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULTS);
  const [activeId, setActiveId] = useState<string>(DEFAULTS[0].id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Vehicle[];
        // Merge stats only — keep image refs from defaults
        setVehicles(DEFAULTS.map((d) => {
          const saved = parsed.find((p) => p.id === d.id);
          return saved ? { ...d, rides: saved.rides, distance: saved.distance } : d;
        }));
      }
      const a = localStorage.getItem(ACTIVE_KEY);
      if (a) setActiveId(a);
    } catch {}
  }, []);

  const persist = (next: Vehicle[]) => {
    setVehicles(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
  }, []);

  const resetStats = useCallback((id: string) => {
    setVehicles((prev) => {
      const next = prev.map((v) => v.id === id ? { ...v, rides: 0, distance: 0 } : v);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const getById = useCallback((id: string) => vehicles.find((v) => v.id === id), [vehicles]);

  return (
    <VehicleContext.Provider value={{ vehicles, activeId, setActive, resetStats, getById }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicles must be used within VehicleProvider");
  return ctx;
}

export function formatDistance(km: number) {
  return `${km.toLocaleString()} km`;
}
