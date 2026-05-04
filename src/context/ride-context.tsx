import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  name: string;
  setName: (n: string) => void;
};

const RideContext = createContext<Ctx | null>(null);

export function RideProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("Sunday Cruise");
  return <RideContext.Provider value={{ name, setName }}>{children}</RideContext.Provider>;
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}
