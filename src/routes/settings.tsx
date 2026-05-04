import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Camera,
  AtSign,
  Globe,
  Gauge,
  Crown,
  FileText,
  Shield,
  RotateCcw,
  Trash2,
  Check,
  LifeBuoy,
  Mail,
  Copy,
  X,
} from "lucide-react";
import { useSocials, SocialEditor } from "@/components/socials";
import { useProfile } from "@/context/profile-context";
import { useI18n, LANG_OPTIONS, type Lang } from "@/context/i18n-context";
import { usePremium } from "@/context/premium-context";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

const UNITS_KEY = "ride.units";

function Settings() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { socials, setSocials } = useSocials();
  const { t, lang, setLang } = useI18n();
  const { isPremium, setPremium } = usePremium();
  const [editingSocials, setEditingSocials] = useState(false);
  const [units, setUnits] = useState<"km" | "mi">("km");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [versionTaps, setVersionTaps] = useState(0);

  useEffect(() => {
    try {
      const u = localStorage.getItem(UNITS_KEY);
      if (u === "km" || u === "mi") setUnits(u);
      if (localStorage.getItem("dev.mode") === "1") setDevMode(true);
    } catch {
      // ignore
    }
  }, []);

  const enableDevMode = () => {
    const next = versionTaps + 1;
    if (next >= 7 && !devMode) {
      setDevMode(true);
      try { localStorage.setItem("dev.mode", "1"); } catch { /* */ }
      setVersionTaps(0);
      return;
    }
    setVersionTaps(next);
  };

  const saveUnits = (u: "km" | "mi") => {
    setUnits(u);
    try { localStorage.setItem(UNITS_KEY, u); } catch { /* */ }
  };

  const linkedCount = (socials.instagram ? 1 : 0) + (socials.tiktok ? 1 : 0);

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto w-full max-w-md px-6 pb-20 pt-12">
        <header className="animate-fade-up flex items-center justify-between">
          <Link
            to="/profile"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("settings.title")}</p>
          <div className="h-10 w-10" />
        </header>

        <h1 className="animate-fade-up mt-6 font-display text-3xl font-light tracking-tight">
          <span className="font-medium italic text-primary">{t("settings.title")}</span>
        </h1>

        {/* Account */}
        <Group title={t("settings.account")} delay={80}>
          <Row icon={<User className="h-4 w-4" />} label={t("settings.edit_profile")} hint={profile.name} onClick={() => navigate({ to: "/edit-profile" })} />
          <Row icon={<Camera className="h-4 w-4" />} label={t("settings.change_picture")} />
          <Row
            icon={<AtSign className="h-4 w-4" />}
            label={t("settings.connected_socials")}
            hint={linkedCount > 0 ? t("settings.linked_count", { n: linkedCount }) : t("settings.none")}
            onClick={() => setEditingSocials(true)}
          />
        </Group>

        {/* App */}
        <Group title={t("settings.app")} delay={140}>
          <SegmentRow
            icon={<Globe className="h-4 w-4" />}
            label={t("settings.language")}
            options={LANG_OPTIONS.map((o) => o.code)}
            optionLabels={Object.fromEntries(LANG_OPTIONS.map((o) => [o.code, o.label]))}
            value={lang}
            onChange={(v) => setLang(v as Lang)}
          />
          <SegmentRow
            icon={<Gauge className="h-4 w-4" />}
            label={t("settings.units")}
            options={["km", "mi"]}
            optionLabels={{ km: "km/h", mi: "mph" }}
            value={units}
            onChange={(v) => saveUnits(v as "km" | "mi")}
          />
        </Group>

        {/* Subscription */}
        <Group title={t("settings.subscription")} delay={200}>
          <Row
            icon={<Crown className="h-4 w-4 text-primary" />}
            label={t("settings.manage_subscription")}
            hint="Rydr Premium"
            highlight
            onClick={() => navigate({ to: "/subscription" })}
          />
        </Group>

        {/* Support */}
        <Group title={t("settings.support")} delay={250}>
          <Row
            icon={<LifeBuoy className="h-4 w-4" />}
            label={t("settings.contact_support")}
            onClick={() => setSupportOpen(true)}
          />
        </Group>

        {/* Legal */}
        <Group title={t("settings.legal")} delay={290}>
          <Row icon={<Shield className="h-4 w-4" />} label={t("settings.privacy")} onClick={() => navigate({ to: "/privacy" })} />
          <Row icon={<FileText className="h-4 w-4" />} label={t("settings.terms")} onClick={() => navigate({ to: "/terms" })} />
        </Group>

        {/* Danger zone */}
        <section className="animate-fade-up mt-8" style={{ animationDelay: "320ms" }}>
          <p className="mb-3 px-1 text-[10px] uppercase tracking-[0.25em] text-destructive/80">
            {t("settings.danger")}
          </p>
          <div className="overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-md">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-destructive/10"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("settings.reset_data")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("settings.reset_data_desc")}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="h-px bg-destructive/15" />
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left text-destructive transition-colors hover:bg-destructive/15"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/15">
                <Trash2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t("settings.delete_account")}</p>
                <p className="text-[11px] text-destructive/80">
                  {t("settings.delete_account_desc")}
                </p>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Apex · v1.0.0
        </p>
      </main>

      <SocialEditor
        open={editingSocials}
        initial={socials}
        onClose={() => setEditingSocials(false)}
        onSave={setSocials}
      />

      <DeleteDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} />
      <SupportSheet open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}

const APP_VERSION = "1.0.0";

function getDeviceInfo() {
  if (typeof navigator === "undefined") {
    return { platform: "unknown", language: "unknown", userAgent: "unknown", screen: "unknown" };
  }
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || "unknown";
  const screen =
    typeof window !== "undefined" && window.screen
      ? `${window.screen.width}x${window.screen.height}`
      : "unknown";
  return {
    platform,
    language: navigator.language || "unknown",
    userAgent: navigator.userAgent || "unknown",
    screen,
  };
}

function SupportSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const email = "rydr.app@outlook.com";
  const subject = "Rydr Support Request";

  const info = getDeviceInfo();
  const body = [
    "Hi, I need help with...",
    "",
    "",
    "— — — — — — — — — — — —",
    "Diagnostics (please keep)",
    `App version: ${APP_VERSION}`,
    `Platform: ${info.platform}`,
    `Language: ${info.language}`,
    `Screen: ${info.screen}`,
    `User agent: ${info.userAgent}`,
  ].join("\n");

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-up absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Need a hand?</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                We usually reply within 24 hours.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</p>
          <p className="mt-1 break-all font-mono text-sm text-foreground">{email}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            App version & device info are auto-attached to help us diagnose faster.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <a
            href={mailto}
            onClick={onClose}
            className="relative flex h-12 w-full items-center justify-center gap-2 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Mail className="h-4 w-4" />
            Email support
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card/60 text-sm font-medium transition-colors hover:border-primary/40"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-primary" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy email address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <section className="animate-fade-up mt-7" style={{ animationDelay: `${delay}ms` }}>
      <p className="mb-3 px-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {title}
      </p>
      <div
        className="overflow-hidden rounded-2xl border border-border backdrop-blur-md"
        style={{ background: "var(--gradient-surface)" }}
      >
        {children}
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  hint,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-card/60"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          highlight ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function SegmentRow({
  icon,
  label,
  options,
  value,
  onChange,
  optionLabels,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  optionLabels?: Record<string, string>;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <div className="flex rounded-full border border-border bg-background/40 p-0.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
              value === o
                ? "bg-primary/20 text-primary shadow-[inset_0_0_0_1px_oklch(0.82_0.16_200/0.3)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {optionLabels?.[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeleteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-up absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-t-3xl border border-destructive/30 bg-card p-6 shadow-[var(--shadow-elegant)] sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold">Delete your account?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This permanently removes your rides, garage, and profile after 30 days.
          You can cancel within that window.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/40"
          >
            <Check className="h-4 w-4" /> Keep account
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-destructive text-sm font-semibold text-destructive-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
