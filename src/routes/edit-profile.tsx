import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, AtSign, Check, Instagram, User as UserIcon } from "lucide-react";
import { useProfile } from "@/context/profile-context";
import { useSocials, TikTokIcon } from "@/components/socials";

export const Route = createFileRoute("/edit-profile")({
  component: EditProfile,
});

function clean(handle: string) {
  return handle.trim().replace(/^@+/, "").replace(/\s+/g, "");
}

const USERNAME_RE = /^[a-zA-Z0-9._]{0,30}$/;

function EditProfile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { socials, setSocials } = useSocials();

  const [username, setUsername] = useState(profile.username);
  const [ig, setIg] = useState(socials.instagram);
  const [tt, setTt] = useState(socials.tiktok);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(profile.username);
  }, [profile.username]);
  useEffect(() => {
    setIg(socials.instagram);
    setTt(socials.tiktok);
  }, [socials.instagram, socials.tiktok]);

  const dirty =
    clean(username) !== profile.username ||
    clean(ig) !== socials.instagram ||
    clean(tt) !== socials.tiktok;

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    const u = clean(username);
    if (!u) {
      setError("Username cannot be empty");
      return;
    }
    if (!USERNAME_RE.test(u)) {
      setError("Use letters, numbers, dots or underscores (max 30)");
      return;
    }
    setError(null);
    setProfile({ ...profile, username: u });
    setSocials({ instagram: ig, tiktok: tt });
    setSaved(true);
    setTimeout(() => navigate({ to: "/profile" }), 450);
  };

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto w-full max-w-md px-6 pb-16 pt-6">
        <header className="animate-fade-up flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/settings" })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-display text-base font-medium">Edit profile</h1>
          <div className="w-10" />
        </header>

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <Field
            icon={<AtSign className="h-4 w-4" />}
            label="Username"
            placeholder="username"
            value={username}
            onChange={setUsername}
            prefix="@"
            maxLength={30}
            delay={60}
          />

          <div
            className="animate-fade-up pt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            style={{ animationDelay: "120ms" }}
          >
            Social links
          </div>

          <Field
            icon={<Instagram className="h-4 w-4" />}
            label="Instagram"
            placeholder="username"
            value={ig}
            onChange={setIg}
            prefix="@"
            maxLength={30}
            delay={140}
          />
          <Field
            icon={<TikTokIcon />}
            label="TikTok"
            placeholder="username"
            value={tt}
            onChange={setTt}
            prefix="@"
            maxLength={30}
            delay={200}
          />

          {error && (
            <p className="animate-fade-up text-xs text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={!dirty && !saved}
            className="animate-fade-up relative mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)", animationDelay: "260ms" }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <Check className="h-4 w-4" strokeWidth={3} />
            {saved ? "Saved" : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  prefix,
  maxLength,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  maxLength?: number;
  delay?: number;
}) {
  return (
    <label className="animate-fade-up block" style={{ animationDelay: `${delay ?? 0}ms` }}>
      <span className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-border bg-background/60 px-3 transition-colors focus-within:border-primary/50">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          maxLength={maxLength}
          className="w-full bg-transparent py-3 pl-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}
