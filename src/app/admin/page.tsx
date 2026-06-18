import Link from "next/link";

import { PageHeader } from "@/components/admin-form";
import { getPrismaClient } from "@/lib/prisma";

async function getOverviewCounts() {
  // Wrap the Prisma calls in try/catch so a transient database
  // outage (or missing env vars in a fresh local checkout) does not
  // crash the entire page — we just render zero counts with a banner.
  try {
    const prisma = getPrismaClient();
    const [faculties, coaches, programmes, resources, faqs] = await Promise.all(
      [
        prisma.faculty.count(),
        prisma.ascCoach.count(),
        prisma.programme.count(),
        prisma.resource.count(),
        prisma.faq.count(),
      ]
    );
    return {
      counts: { faculties, coaches, programmes, resources, faqs },
      error: null as string | null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    // Surface in server logs but keep the page rendering.
    console.error("[admin/page] overview counts failed:", message);
    return {
      counts: { faculties: 0, coaches: 0, programmes: 0, resources: 0, faqs: 0 },
      error: message,
    };
  }
}

const shortcuts = [
  {
    href: "/admin/faculties",
    label: "Faculties",
    description: "Manage faculty master records and verification metadata.",
  },
  {
    href: "/admin/coaches",
    label: "ASC Coaches",
    description: "Maintain coach contact details and active assignments.",
  },
  {
    href: "/admin/programmes",
    label: "Programmes",
    description: "Review programme metadata and curriculum links.",
  },
];

export default async function AdminHomePage() {
  const { counts, error } = await getOverviewCounts();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Project ASC admin dashboard"
        description="Use this workspace to keep the core support content accurate, linked, and ready for the bot."
      />

      {error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger-foreground)]"
        >
          <p className="font-medium">
            Live counts are temporarily unavailable.
          </p>
          <p className="mt-0.5 text-xs opacity-80">
            The database could not be reached. Counts below show zero until
            the connection is restored. ({error})
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 animate-slide-up">
        {[
          { label: "Faculties", value: counts.faculties },
          { label: "ASC Coaches", value: counts.coaches },
          { label: "Programmes", value: counts.programmes },
          { label: "Resources", value: counts.resources },
          { label: "FAQs", value: counts.faqs },
        ].map((item, index) => (
          <article
            key={item.label}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-md)] animate-slide-up"
            style={{
              "--animation-delay": `${index * 50}ms`,
            } as React.CSSProperties}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              {item.label}
            </p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-brand-strong)]">
              {item.value}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3 animate-slide-up">
        {shortcuts.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-md)] animate-slide-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
            style={{
              "--animation-delay": `${200 + index * 50}ms`,
            } as React.CSSProperties}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Quick access
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
              {item.label}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
