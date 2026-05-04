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
  color?: string;
  custom?: boolean;
};

const DEFAULTS: Vehicle[] = [
  { id: "bmw-m4", name: "BMW M4", sub: "Competition · 2023", type: "car", rides: 42, distance: 3210, image: carBmw },
  { id: "yamaha-r1", name: "Yamaha R1", sub: "Race Blu · 2022", type: "moto", rides: 86, distance: 5684, image: motoYamaha },
];

const STORAGE_KEY = "garage.vehicles";
const ACTIVE_KEY = "garage.active";
const CUSTOM_KEY = "garage.custom";

type StatPatch = { rides?: number; distance?: number };
type StoredDefault = { id: string } & StatPatch;

type Ctx = {
  vehicles: Vehicle[];
  activeId: string;
  setActive: (id: string) => void;
  resetStats: (id: string) => void;
  addVehicle: (input: { name: string; type: VehicleType; color?: string }) => Vehicle;
  getById: (id: string) => Vehicle | undefined;
};

const VehicleContext = createContext<Ctx | null>(null);

function slug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "vehicle";
}

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULTS);
  const [activeId, setActiveId] = useState<string>(DEFAULTS[0].id);

  useEffect(() => {
    try {
      const rawCustom = localStorage.getItem(CUSTOM_KEY);
      const custom: Vehicle[] = rawCustom ? JSON.parse(rawCustom) : [];

      const rawStats = localStorage.getItem(STORAGE_KEY);
      const stats: StoredDefault[] = rawStats ? JSON.parse(rawStats) : [];

      const merged = [
        ...DEFAULTS.map((d) => {
          const s = stats.find((p) => p.id === d.id);
          return s ? { ...d, rides: s.rides ?? d.rides, distance: s.distance ?? d.distance } : d;
        }),
        ...custom,
      ];
      setVehicles(merged);

      const a = localStorage.getItem(ACTIVE_KEY);
      if (a && merged.some((v) => v.id === a)) setActiveId(a);
    } catch {}
  }, []);

  const persistAll = (next: Vehicle[]) => {
    try {
      const stats: StoredDefault[] = next
        .filter((v) => !v.custom)
        .map((v) => ({ id: v.id, rides: v.rides, distance: v.distance }));
      const custom = next.filter((v) => v.custom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    } catch {}
  };

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
  }, []);

  const resetStats = useCallback((id: string) => {
    setVehicles((prev) => {
      const next = prev.map((v) => v.id === id ? { ...v, rides: 0, distance: 0 } : v);
      persistAll(next);
      return next;
    });
  }, []);

  const addVehicle = useCallback<Ctx["addVehicle"]>((input) => {
    const name = input.name.trim();
    const baseId = slug(name);
    let created!: Vehicle;
    setVehicles((prev) => {
      let id = baseId;
      let n = 2;
      while (prev.some((v) => v.id === id)) id = `${baseId}-${n++}`;
      const placeholder = input.type === "car" ? carBmw : motoYamaha;
      created = {
        id,
        name,
        sub: input.color ? `${input.color}` : input.type === "car" ? "Car" : "Motorcycle",
        type: input.type,
        rides: 0,
        distance: 0,
        image: placeholder,
        color: input.color,
        custom: true,
      };
      const next = [...prev, created];
      persistAll(next);
      return next;
    });
    return created;
  }, []);

  const getById = useCallback((id: string) => vehicles.find((v) => v.id === id), [vehicles]);

  return (
    <VehicleContext.Provider value={{ vehicles, activeId, setActive, resetStats, addVehicle, getById }}>
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
