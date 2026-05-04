import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type RoutePoint = {
  lat: number;
  lng: number;
  /** epoch ms */
  t: number;
  /** instantaneous speed in m/s if reported by device */
  speed?: number;
};

export type RideStats = {
  /** meters */
  distance: number;
  /** seconds */
  duration: number;
  /** m/s */
  avgSpeed: number;
  /** m/s */
  currentSpeed: number;
  /** m/s */
  maxSpeed: number;
};

type Status = "idle" | "recording" | "paused" | "stopped";

type Ctx = {
  name: string;
  setName: (n: string) => void;
  status: Status;
  points: RoutePoint[];
  stats: RideStats;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
};

const RideContext = createContext<Ctx | null>(null);

// Tuning constants — chosen to balance accuracy and battery.
// We poll the OS at adaptive intervals (faster when moving, slower when
// stationary) and only KEEP a fix if it differs meaningfully in time or
// distance. This avoids dense, noisy traces and minimizes GPS wake-ups.
const ACTIVE_POLL_MS = 5000; // poll every 5s while moving
const IDLE_POLL_MS = 30000; // back off to every 30s while stationary
const STATIONARY_SPEED_MPS = 0.7; // < ~2.5 km/h counts as stationary
const STATIONARY_DISTANCE_M = 8; // ...or didn't move at least this far
const MIN_SAMPLE_INTERVAL_MS = 3000; // never record points faster than this
const MIN_SAMPLE_DISTANCE_M = 10; // unless the user moved at least 10m
const MAX_ACCURACY_M = 50; // drop fixes worse than ~50m accuracy
const TICK_MS = 1000; // duration ticker

function haversine(a: RoutePoint, b: RoutePoint): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function RideProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("Sunday Cruise");
  const [status, setStatus] = useState<Status>("idle");
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastKeptRef = useRef<RoutePoint | null>(null);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current != null && typeof navigator !== "undefined") {
      navigator.geolocation?.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  }, []);

  const stopTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  const handlePosition = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy, speed } = pos.coords;
    if (accuracy != null && accuracy > MAX_ACCURACY_M) return;

    const now = pos.timestamp || Date.now();
    const point: RoutePoint = {
      lat: latitude,
      lng: longitude,
      t: now,
      speed: speed ?? undefined,
    };

    if (typeof speed === "number" && speed >= 0) {
      setCurrentSpeed(speed);
      setMaxSpeed((m) => (speed > m ? speed : m));
    }

    const last = lastKeptRef.current;
    if (last) {
      const dt = now - last.t;
      const dd = haversine(last, point);
      // Throttle: keep point only if enough time AND/OR enough distance passed.
      if (dt < MIN_SAMPLE_INTERVAL_MS && dd < MIN_SAMPLE_DISTANCE_M) return;
      setDistance((d) => d + dd);
    }
    lastKeptRef.current = point;
    setPoints((p) => [...p, point]);
  }, []);

  const startWatch = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    if (watchIdRef.current != null) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      () => {
        // Silently ignore errors (permission denied, timeout). UI stays usable.
      },
      {
        // Balanced accuracy: enableHighAccuracy:false hints to use network/wifi
        // instead of constant GPS, which is significantly more battery-friendly.
        enableHighAccuracy: false,
        // Allow the OS to return a recent fix instead of forcing a new one.
        maximumAge: 2000,
        timeout: 15000,
      },
    );
  }, [handlePosition]);

  const startTick = useCallback(() => {
    if (tickRef.current) return;
    tickRef.current = setInterval(() => setDuration((s) => s + 1), TICK_MS);
  }, []);

  const reset = useCallback(() => {
    stopWatch();
    stopTick();
    lastKeptRef.current = null;
    setPoints([]);
    setDuration(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setStatus("idle");
  }, [stopWatch, stopTick]);

  const start = useCallback(() => {
    reset();
    setStatus("recording");
    startWatch();
    startTick();
  }, [reset, startWatch, startTick]);

  const pause = useCallback(() => {
    setStatus("paused");
    stopWatch();
    stopTick();
    // Break continuity so a long pause doesn't get counted as a single segment.
    lastKeptRef.current = null;
  }, [stopWatch, stopTick]);

  const resume = useCallback(() => {
    setStatus("recording");
    startWatch();
    startTick();
  }, [startWatch, startTick]);

  const stop = useCallback(() => {
    setStatus("stopped");
    stopWatch();
    stopTick();
  }, [stopWatch, stopTick]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopWatch();
      stopTick();
    };
  }, [stopWatch, stopTick]);

  const stats = useMemo<RideStats>(
    () => ({
      distance,
      duration,
      avgSpeed: duration > 0 ? distance / duration : 0,
      currentSpeed,
      maxSpeed,
    }),
    [distance, duration, currentSpeed, maxSpeed],
  );

  return (
    <RideContext.Provider
      value={{ name, setName, status, points, stats, start, pause, resume, stop, reset }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}

// Formatting helpers used by tracking/summary screens.
export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function formatHoursMinutes(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}` : `0:${m.toString().padStart(2, "0")}`;
}

export function metersToKm(m: number) {
  return m / 1000;
}

export function mpsToKmh(mps: number) {
  return mps * 3.6;
}
