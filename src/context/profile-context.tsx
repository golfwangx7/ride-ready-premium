import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

const STORAGE_KEY = "profile.info";

export type ProfileInfo = {
  name: string;
  username: string;
  location: string;
};

const DEFAULT: ProfileInfo = {
  name: "Alex Carter",
  username: "alex.rides",
  location: "San Francisco",
};

type Ctx = {
  profile: ProfileInfo;
  setProfile: (next: ProfileInfo) => void;
  updateProfile: (patch: Partial<ProfileInfo>) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileInfo>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const setProfile = useCallback((next: ProfileInfo) => {
    setProfileState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const updateProfile = useCallback((patch: Partial<ProfileInfo>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
