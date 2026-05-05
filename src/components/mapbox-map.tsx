import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const TOKEN_KEY = "mapbox.token";
// Public Mapbox token can also be hardcoded once provided. It is safe to ship in client code.
const ENV_TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? "";

export function getMapboxToken(): string {
  if (ENV_TOKEN) return ENV_TOKEN;
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setMapboxToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

type Props = {
  center?: [number, number]; // [lng, lat]
  route?: Array<[number, number]>;
  follow?: boolean;
  className?: string;
};

export function MapboxMap({ center, route, follow = true, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState<string>(() => getMapboxToken());
  const [tokenInput, setTokenInput] = useState("");
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  // Geolocate (best-effort; show fallback if denied).
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc([pos.coords.longitude, pos.coords.latitude]),
      () => {/* permission denied - fallback to default */},
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 8000 }
    );
  }, []);

  const initialCenter: [number, number] = center ?? userLoc ?? [-122.4194, 37.7749];

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: 13,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      // User location marker
      const el = document.createElement("div");
      el.className = "mapbox-user-marker";
      el.style.cssText = `
        width: 16px; height: 16px; border-radius: 50%;
        background: oklch(0.82 0.16 200); border: 2px solid oklch(0.14 0.012 250);
        box-shadow: 0 0 24px oklch(0.82 0.16 200 / 0.8);
      `;
      markerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(initialCenter)
        .addTo(map);

      if (route && route.length > 1) {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "oklch(0.82 0.16 200)",
            "line-width": 4,
            "line-opacity": 0.9,
          },
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Update marker + center when location/center changes
  useEffect(() => {
    const map = mapRef.current;
    const next = center ?? userLoc;
    if (!map || !next) return;
    markerRef.current?.setLngLat(next);
    if (follow) map.easeTo({ center: next, duration: 800 });
  }, [center, userLoc, follow]);

  // Update route line as new points come in
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route || route.length < 2) return;
    const apply = () => {
      const src = map.getSource("route") as mapboxgl.GeoJSONSource | undefined;
      if (src) {
        src.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } });
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [route]);

  if (!token) {
    return (
      <div className={`relative flex flex-col items-center justify-center gap-3 bg-card/40 p-6 text-center ${className}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-sm font-medium">Map setup needed</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Paste your Mapbox public token to enable the live map.<br />
            Get one at <span className="text-primary">mapbox.com/access-tokens</span>
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <input
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="pk.eyJ1Ij..."
            className="w-full rounded-full border border-border bg-background/60 px-4 py-2 text-xs outline-none focus:border-primary/50"
          />
          <button
            type="button"
            onClick={() => {
              if (!tokenInput.trim()) return;
              setMapboxToken(tokenInput.trim());
              setToken(tokenInput.trim());
            }}
            className="rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            Save token
          </button>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
