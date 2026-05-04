import { Bike, Car } from "lucide-react";
import { useMode, type Mode } from "@/context/mode-context";

type Props = {
  size?: "sm" | "md";
  className?: string;
};

export function ModeToggle({ size = "md", className = "" }: Props) {
  const { mode, setMode } = useMode();
  const isSm = size === "sm";

  return (
    <div
      className={`relative grid grid-cols-2 rounded-full border border-border bg-card/60 ${isSm ? "p-1" : "p-1.5"} backdrop-blur-xl ${className}`}
    >
      <span
        className={`absolute ${isSm ? "inset-y-1" : "inset-y-1.5"} rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{
          width: `calc(50% - ${isSm ? "0.25rem" : "0.375rem"})`,
          left: mode === "moto" ? (isSm ? "0.25rem" : "0.375rem") : "50%",
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow-sm)",
        }}
      />
      <Btn active={mode === "moto"} onClick={() => setMode("moto")} sm={isSm}>
        <Bike className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Motorcycle
      </Btn>
      <Btn active={mode === "car"} onClick={() => setMode("car")} sm={isSm}>
        <Car className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Car
      </Btn>
    </div>
  );
}

function Btn({
  active,
  onClick,
  children,
  sm,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  sm: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex items-center justify-center gap-2 rounded-full ${sm ? "py-1.5 text-[11px]" : "py-2.5 text-sm"} font-medium transition-colors duration-300 ${
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function modeStats(mode: Mode) {
  return mode === "moto"
    ? { rides: 86, distance: "5,684", top: 142 }
    : { rides: 42, distance: "3,210", top: 168 };
}
