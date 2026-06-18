"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { TextInput } from "@/components/admin-form";
import { cn } from "@/lib/cn";

type CoachRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cell: string | null;
  titleRole: string | null;
  level: string;
  cluster: string | null;
  isActive: boolean;
  verificationStatus: string | null;
  faculty: {
    id: string;
    name: string;
    code: string;
  };
};

function normaliseStatus(value: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function statusTone(value: string | null) {
  const status = normaliseStatus(value);
  if (status.includes("verified")) return "success";
  if (status.includes("review") || status.includes("pending")) return "warning";
  return "neutral";
}

function sectionInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function safeContact(value: string | null) {
  return value?.trim() || "Not set";
}

function compactStatus(value: string | null) {
  const status = value?.trim();
  if (!status) return "Unspecified";
  return status.replace(/[_-]/g, " ");
}

type CoachDirectoryProps = {
  coaches: CoachRow[];
};

export function CoachDirectory({ coaches }: CoachDirectoryProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = coaches.filter((coach) => {
      const matchesQuery =
        !q ||
        coach.name.toLowerCase().includes(q) ||
        coach.email.toLowerCase().includes(q) ||
        (coach.titleRole ?? "").toLowerCase().includes(q) ||
        (coach.cluster ?? "").toLowerCase().includes(q) ||
        coach.faculty.name.toLowerCase().includes(q) ||
        coach.faculty.code.toLowerCase().includes(q);

      const status = normaliseStatus(coach.verificationStatus);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && coach.isActive) ||
        (statusFilter === "inactive" && !coach.isActive) ||
        (statusFilter === "verified" && status.includes("verified")) ||
        (statusFilter === "needs-review" && !status.includes("verified"));

      const matchesFaculty =
        facultyFilter === "all" || coach.faculty.id === facultyFilter;

      return matchesQuery && matchesStatus && matchesFaculty;
    });

    const buckets = new Map<
      string,
      { faculty: CoachRow["faculty"]; coaches: CoachRow[] }
    >();

    for (const coach of filtered) {
      const bucket = buckets.get(coach.faculty.id);
      if (bucket) {
        bucket.coaches.push(coach);
      } else {
        buckets.set(coach.faculty.id, { faculty: coach.faculty, coaches: [coach] });
      }
    }

    return Array.from(buckets.values()).sort((a, b) =>
      a.faculty.name.localeCompare(b.faculty.name),
    );
  }, [coaches, facultyFilter, query, statusFilter]);

  const facultyOptions = useMemo(
    () =>
      Array.from(new Map(coaches.map((coach) => [coach.faculty.id, coach.faculty])).values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [coaches],
  );

  const stats = useMemo(() => {
    const active = coaches.filter((coach) => coach.isActive).length;
    const inactive = coaches.length - active;
    const verified = coaches.filter((coach) =>
      normaliseStatus(coach.verificationStatus).includes("verified"),
    ).length;
    const withPhone = coaches.filter((coach) => Boolean(coach.phone || coach.cell)).length;

    return { active, inactive, verified, withPhone };
  }, [coaches]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
      <div className="space-y-4">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Coach directory
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                  Structured like a contact book
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Grouped by faculty so users can jump straight to the right team instead of scanning one long table.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Active</div>
                  <div className="mt-1 text-lg font-semibold">{stats.active}</div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Inactive</div>
                  <div className="mt-1 text-lg font-semibold">{stats.inactive}</div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Verified</div>
                  <div className="mt-1 text-lg font-semibold">{stats.verified}</div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Contacts</div>
                  <div className="mt-1 text-lg font-semibold">{stats.withPhone}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_auto]">
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by coach, email, title, faculty, or cluster"
              />

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "inactive", label: "Inactive" },
                  { key: "verified", label: "Verified" },
                  { key: "needs-review", label: "Needs review" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-medium transition",
                      statusFilter === item.key
                        ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-text)]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFacultyFilter("all")}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-medium transition whitespace-nowrap",
              facultyFilter === "all"
                ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
            )}
          >
            All faculties
          </button>
          {facultyOptions.map((faculty) => (
            <button
              key={faculty.id}
              type="button"
              onClick={() => setFacultyFilter(faculty.id)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm font-medium transition whitespace-nowrap",
                facultyFilter === faculty.id
                  ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
              )}
            >
              {faculty.name}
            </button>
          ))}
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          {grouped.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <p className="text-lg font-semibold">No coaches match this filter.</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Clear the search or switch faculty filters to bring the directory back.
                </p>
              </CardBody>
            </Card>
          ) : (
            grouped.map(({ faculty, coaches: facultyCoaches }) => {
              const isCollapsed = collapsed[faculty.id] ?? false;

              return (
                <section key={faculty.id} className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-card)]">
                  <button
                    type="button"
                    onClick={() => setCollapsed((current) => ({ ...current, [faculty.id]: !isCollapsed }))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-brand-soft)] text-sm font-semibold text-[var(--color-brand-soft-foreground)]">
                        {sectionInitials(faculty.name)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold tracking-tight">{faculty.name}</h3>
                          <Badge tone="neutral" outlined>
                            {faculty.code}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {facultyCoaches.length} coach{facultyCoaches.length === 1 ? "" : "es"} in this section
                        </p>
                      </div>
                    </div>

                    <Badge tone="brand" outlined>
                      {isCollapsed ? "Expand" : "Collapse"}
                    </Badge>
                  </button>

                  {!isCollapsed ? (
                    <div className="grid gap-3 border-t border-[var(--color-border)] p-4 md:grid-cols-2 xl:grid-cols-3">
                      {facultyCoaches.map((coach) => {
                        const status = compactStatus(coach.verificationStatus);

                        return (
                          <Card key={coach.id} className="border-[var(--color-border)] shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(0,32,80,0.08)]">
                            <CardBody className="space-y-4 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-base font-semibold tracking-tight">{coach.name}</h4>
                                    <Badge tone={coach.isActive ? "success" : "danger"} outlined>
                                      {coach.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-[var(--color-text-muted)]">{coach.titleRole ?? "Coach contact"}</p>
                                </div>
                                <Badge tone="neutral" outlined>
                                  {coach.level}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Badge tone={statusTone(coach.verificationStatus)} outlined>
                                  {status}
                                </Badge>
                                {coach.cluster ? (
                                  <Badge tone="neutral" outlined>
                                    {coach.cluster}
                                  </Badge>
                                ) : null}
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-start justify-between gap-4">
                                  <span className="text-[var(--color-text-muted)]">Email</span>
                                  <a className="font-medium text-[var(--color-brand)] hover:underline" href={`mailto:${coach.email}`}>
                                    {coach.email}
                                  </a>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                  <span className="text-[var(--color-text-muted)]">Phone</span>
                                  <span className="font-medium">{safeContact(coach.phone)}</span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                  <span className="text-[var(--color-text-muted)]">Cell</span>
                                  <span className="font-medium">{safeContact(coach.cell)}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 pt-1">
                                <Link
                                  href={`/admin/coaches/${coach.id}`}
                                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] px-3 py-2 text-xs font-medium text-[var(--color-brand-foreground)] transition-colors hover:bg-[var(--color-brand-strong)]"
                                >
                                  Open
                                </Link>
                                <a
                                  href={`mailto:${coach.email}`}
                                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-sunken)]"
                                >
                                  Email
                                </a>
                              </div>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              );
            })
          )}
        </div>
      </div>

      <div className="xl:sticky xl:top-6">
        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Directory notes
              </p>
              <h3 className="text-xl font-semibold tracking-tight">Designed for quick contact lookup</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                This page now behaves like a faculty-organized contact book, so users can browse, collapse, and open records without losing context.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
              <p className="font-medium">What to test</p>
              <ul className="space-y-2 text-[var(--color-text-muted)]">
                <li>Search coaches by name, email, role, or faculty.</li>
                <li>Switch between status filters and faculty chips.</li>
                <li>Collapse and expand a faculty section.</li>
                <li>Open a coach record from a contact card.</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
