import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsOfService,
  head: () => ({
    meta: [
      { title: "Terms of Service · Rydr" },
      { name: "description", content: "The terms that govern your use of Rydr." },
    ],
  }),
});

function TermsOfService() {
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-light tracking-tight">
              <span className="font-medium italic text-primary">Terms</span> of Service
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
          <p>By using Rydr, you agree to the following terms:</p>

          <Section title="1. Use of the App">
            <p>
              Rydr is a ride tracking application for cars and motorcycles. You agree to use the app
              responsibly and in compliance with all laws.
            </p>
          </Section>

          <Section title="2. Safety Disclaimer">
            <p>Rydr does not encourage unsafe driving or speeding.</p>
            <p>You are fully responsible for:</p>
            <List items={[
              "Your driving behavior",
              "Following traffic laws",
              "Ensuring your own safety and the safety of others",
            ]} />
            <p>
              Rydr is not liable for accidents, injuries, or damages resulting from the use of the
              app.
            </p>
          </Section>

          <Section title="3. User Content">
            <p>You are responsible for any content you share, including:</p>
            <List items={["Ride data", "Profile information", "Social links"]} />
            <p>You must not post harmful, illegal, or misleading content.</p>
          </Section>

          <Section title="4. Accounts">
            <p>You are responsible for maintaining your account and keeping your information accurate.</p>
          </Section>

          <Section title="5. Subscription (if applicable)">
            <p>Rydr may offer premium features via subscription.</p>
            <List items={[
              "Payments are handled through app stores",
              "Subscriptions renew automatically unless canceled",
              "You can manage subscriptions via your app store account",
            ]} />
          </Section>

          <Section title="6. Termination">
            <p>We may suspend or terminate accounts that violate these terms.</p>
          </Section>

          <Section title="7. Disclaimer">
            <p>Rydr is provided "as is" without warranties of any kind.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>Rydr is not liable for:</p>
            <List items={["Data loss", "Service interruptions", "Any damages related to app usage"]} />
          </Section>

          <Section title="9. Changes to Terms">
            <p>We may update these Terms at any time.</p>
          </Section>

          <Section title="10. Contact">
            <p>For questions, contact:</p>
            <a
              href="mailto:rydr.app@outlook.com"
              className="inline-block text-primary transition-colors hover:text-primary/80"
            >
              rydr.app@outlook.com
            </a>
          </Section>

          <p className="border-t border-border pt-6 text-foreground">
            By using Rydr, you agree to these Terms.
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
