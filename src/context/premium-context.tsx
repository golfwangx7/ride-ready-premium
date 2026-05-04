import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

type Ctx = {
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
};

const PremiumContext = createContext<Ctx | null>(null);
const KEY = "user.premium";

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

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

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        setPremium,
        paywallOpen,
        openPaywall: () => setPaywallOpen(true),
        closePaywall: () => setPaywallOpen(false),
      }}
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
