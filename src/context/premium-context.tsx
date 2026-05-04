import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

type OpenOpts = { reason?: string };

type Ctx = {
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  paywallOpen: boolean;
  paywallReason: string | null;
  openPaywall: (opts?: OpenOpts) => void;
  closePaywall: () => void;
};

const PremiumContext = createContext<Ctx | null>(null);
const KEY = "user.premium";

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "1") setIsPremium(true);
    } catch { /* ignore */ }
  }, []);

  const setPremium = useCallback((v: boolean) => {
    setIsPremium(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
  }, []);

  const openPaywall = useCallback((opts?: OpenOpts) => {
    setPaywallReason(opts?.reason ?? null);
    setPaywallOpen(true);
  }, []);

  const closePaywall = useCallback(() => {
    setPaywallOpen(false);
    setPaywallReason(null);
  }, []);

  return (
    <PremiumContext.Provider
      value={{ isPremium, setPremium, paywallOpen, paywallReason, openPaywall, closePaywall }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
}
