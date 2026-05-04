import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      { title: "Privacy Policy · Rydr" },
      { name: "description", content: "How Rydr collects, uses, and protects your data." },
    ],
  }),
});

function PrivacyPolicy() {
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <main className="relative mx-auto w-full max-w-2xl px-6 pb-24 pt-12">
        <header className="animate-fade-up flex items-center justify-between">
          <Link
            to="/settings"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Legal</p>
          <div className="h-10 w-10" />
        </header>

        <div className="animate-fade-up mt-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 text-primary backdrop-blur-md">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-light tracking-tight">
              <span className="font-medium italic text-primary">Privacy</span> Policy
            </h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Last updated: 04.05.2026
            </p>
          </div>
        </div>

        <article
          className="animate-fade-up mt-8 space-y-6 rounded-3xl border border-border p-6 text-sm leading-relaxed text-muted-foreground backdrop-blur-md sm:p-8"
          style={{ background: "var(--gradient-surface)" }}
        >
          <p>Welcome to Rydr.</p>
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and
            protect your information when you use the Rydr mobile application.
          </p>

          <Section title="1. Information We Collect">
            <Sub title="a) Personal Information">
              <List items={[
                "Username",
                "Email address (if required for account creation)",
                "Profile picture",
                "Linked social media usernames (Instagram, TikTok)",
              ]} />
            </Sub>
            <Sub title="b) Usage Data">
              <List items={["Ride data (routes, distance, duration, speed)", "App interactions"]} />
            </Sub>
            <Sub title="c) Location Data">
              <p>
                Rydr collects location data while you use the app to track your rides. This includes
                GPS data to display routes and generate ride statistics.
              </p>
            </Sub>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your data to:</p>
            <List items={[
              "Provide ride tracking functionality",
              "Display ride statistics",
              "Improve app performance and user experience",
              "Enable social features (sharing rides, profiles)",
            ]} />
          </Section>

          <Section title="3. Sharing of Information">
            <p>We do not sell your personal data.</p>
            <p>Information may be shared:</p>
            <List items={[
              "With other users (only if you choose to publish rides or profile info)",
              "With service providers (e.g. hosting, analytics)",
            ]} />
          </Section>

          <Section title="4. Data Storage & Security">
            <p>We take reasonable measures to protect your data. However, no system is 100% secure.</p>
          </Section>

          <Section title="5. Your Choices">
            <p>You can:</p>
            <List items={[
              "Edit or delete your profile information",
              "Set rides as private or public",
              "Delete your account at any time",
            ]} />
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your data as long as your account is active or as needed to provide services.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>Rydr is not intended for users under 13 years of age.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We may update this Privacy Policy. Changes will be posted in the app.</p>
          </Section>

          <Section title="9. Contact">
            <p>If you have questions, contact us at:</p>
            <a
              href="mailto:rydr.app@outlook.com"
              className="inline-block text-primary transition-colors hover:text-primary/80"
            >
              rydr.app@outlook.com
            </a>
          </Section>

          <p className="border-t border-border pt-6 text-foreground">
            By using Rydr, you agree to this Privacy Policy.
          </p>
        </article>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80">{title}</h3>
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5">
          <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
