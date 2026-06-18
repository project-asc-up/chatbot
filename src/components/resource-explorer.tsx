import Link from "next/link";
import { ExternalLink, FileText, MapPin } from "lucide-react";

type ResourceRow = {
  id: string;
  seedKey: string | null;
  category: string;
  title: string;
  description: string | null;
  url: string;
  sourceUrl: string | null;
  lastVerified: Date | null;
  faculty: { id: string; name: string; code: string } | null;
};

function getHostName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External link";
  }
}

function formatDate(value: Date | null) {
  if (!value) return "Unverified";
  return new Intl.DateTimeFormat("en-ZA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function ResourceExplorer({ resources }: { resources: ResourceRow[] }) {
  const grouped = resources.reduce<Map<string, ResourceRow[]>>((acc, resource) => {
    const key = resource.faculty?.name ?? "General";
    const list = acc.get(key) ?? [];
    list.push(resource);
    acc.set(key, list);
    return acc;
  }, new Map());

  const sections = Array.from(grouped.entries()).sort(([left], [right]) => {
    if (left === "General") return -1;
    if (right === "General") return 1;
    return left.localeCompare(right);
  });

  const generalCount = grouped.get("General")?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-light)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
            Total resources
          </p>
          <div className="mt-3 text-3xl font-semibold text-[color:var(--color-primary-dark)]">
            {resources.length}
          </div>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-light)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
            Faculty linked
          </p>
          <div className="mt-3 text-3xl font-semibold text-[color:var(--color-primary-dark)]">
            {resources.length - generalCount}
          </div>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-light)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
            General library
          </p>
          <div className="mt-3 text-3xl font-semibold text-[color:var(--color-primary-dark)]">
            {generalCount}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map(([facultyName, items]) => (
          <section key={facultyName} className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-primary-dark)]">
                  {facultyName}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {items.length} resource{items.length === 1 ? "" : "s"} in this collection.
                </p>
              </div>
              <div className="rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                Scrollable cards
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {items.map((resource) => (
                <article
                  key={resource.id}
                  className="min-w-[19rem] max-w-[24rem] flex-1 rounded-[1.5rem] border border-[color:var(--color-border)] bg-white p-5 shadow-[0_12px_40px_rgba(0,32,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,32,80,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-[color:var(--color-bg-light)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary-dark)]">
                      {resource.category}
                    </span>
                    <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-medium text-[color:var(--color-text-muted)]">
                      {formatDate(resource.lastVerified)}
                    </span>
                  </div>

                  <h4 className="mt-4 text-lg font-semibold tracking-tight text-[color:var(--color-primary-dark)]">
                    {resource.title}
                  </h4>

                  {resource.description ? (
                    <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
                      {resource.description}
                    </p>
                  ) : null}

                  <div className="mt-4 space-y-2 text-sm text-[color:var(--color-text-muted)]">
                    <div className="flex items-center gap-2">
                      <FileText size={15} />
                      <span className="truncate">{getHostName(resource.url)}</span>
                    </div>
                    {resource.faculty ? (
                      <div className="flex items-center gap-2">
                        <MapPin size={15} />
                        <span>
                          {resource.faculty.code} - {resource.faculty.name}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/resources/${resource.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-light)]"
                    >
                      View / edit
                    </Link>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-hover)]"
                    >
                      Open
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
