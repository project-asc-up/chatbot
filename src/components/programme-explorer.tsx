"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription } from "@/components/ui/card";
import { TextInput } from "@/components/admin-form";
import { cn } from "@/lib/cn";

type ProgrammeRow = {
  id: string;
  programmeCode: string;
  programmeName: string;
  degreeName: string | null;
  academicLevel: string | null;
  qualificationType: string | null;
  durationYears: number | null;
  programmeCredits: number | null;
  yearLevels: string | null;
  faculty: {
    id: string;
    name: string;
    code: string;
  };
  _count: {
    courseModules: number;
  };
};

function yearTokens(value: string | null) {
  if (!value) return [];
  return value
    .split(/[;,|]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function detailTone(value: string | null) {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("post")) return "accent";
  if (normalized.includes("under")) return "brand";
  if (normalized.includes("diploma")) return "info";
  return "neutral";
}

type ProgrammeExplorerProps = {
  programmes: ProgrammeRow[];
};

export function ProgrammeExplorer({ programmes }: ProgrammeExplorerProps) {
  const [query, setQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const facultyOptions = useMemo(
    () =>
      Array.from(new Map(programmes.map((programme) => [programme.faculty.id, programme.faculty])).values()).sort(
        (a, b) => a.name.localeCompare(b.name),
      ),
    [programmes],
  );

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = programmes.filter((programme) => {
      const matchesQuery =
        !q ||
        programme.programmeName.toLowerCase().includes(q) ||
        programme.programmeCode.toLowerCase().includes(q) ||
        (programme.degreeName ?? "").toLowerCase().includes(q) ||
        (programme.qualificationType ?? "").toLowerCase().includes(q) ||
        programme.faculty.name.toLowerCase().includes(q) ||
        programme.faculty.code.toLowerCase().includes(q);

      const matchesFaculty = facultyFilter === "all" || programme.faculty.id === facultyFilter;
      return matchesQuery && matchesFaculty;
    });

    const buckets = new Map<
      string,
      { faculty: ProgrammeRow["faculty"]; programmes: ProgrammeRow[] }
    >();

    for (const programme of filtered) {
      const bucket = buckets.get(programme.faculty.id);
      if (bucket) {
        bucket.programmes.push(programme);
      } else {
        buckets.set(programme.faculty.id, { faculty: programme.faculty, programmes: [programme] });
      }
    }

    return Array.from(buckets.values()).sort((a, b) =>
      a.faculty.name.localeCompare(b.faculty.name),
    );
  }, [facultyFilter, programmes, query]);

  const stats = useMemo(() => {
    const totalModules = programmes.reduce((sum, programme) => sum + programme._count.courseModules, 0);
    const withDuration = programmes.filter((programme) => programme.durationYears !== null).length;
    const withYearLevels = programmes.filter((programme) => Boolean(programme.yearLevels)).length;
    return { totalModules, withDuration, withYearLevels };
  }, [programmes]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
      <div className="space-y-4">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Curriculum explorer
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                  Browse programmes by faculty
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  The layout emphasizes curriculum hierarchy, so users can scan by faculty, then by programme, then open the full record when needed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Programmes</div>
                  <div className="mt-1 text-lg font-semibold">{programmes.length}</div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Modules</div>
                  <div className="mt-1 text-lg font-semibold">{stats.totalModules}</div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Year maps</div>
                  <div className="mt-1 text-lg font-semibold">{stats.withYearLevels}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_auto]">
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by programme, code, faculty, qualification, or degree"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFacultyFilter("all")}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
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
                      "rounded-full border px-3 py-2 text-sm font-medium transition",
                      facultyFilter === faculty.id
                        ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
                    )}
                  >
                    {faculty.name}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          {grouped.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <p className="text-lg font-semibold">No programmes match this filter.</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Clear the search or switch faculties to continue browsing.
                </p>
              </CardBody>
            </Card>
          ) : (
            grouped.map(({ faculty, programmes: facultyProgrammes }) => {
              const isCollapsed = collapsed[faculty.id] ?? false;
              return (
                <section key={faculty.id} className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-card)]">
                  <button
                    type="button"
                    onClick={() => setCollapsed((current) => ({ ...current, [faculty.id]: !isCollapsed }))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">{faculty.name}</h3>
                        <Badge tone="neutral" outlined>
                          {faculty.code}
                        </Badge>
                        <Badge tone="brand" outlined>
                          {facultyProgrammes.length} programme{facultyProgrammes.length === 1 ? "" : "s"}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Grouped curriculum records for this faculty.
                      </p>
                    </div>
                    <Badge tone="brand" outlined>{isCollapsed ? "Expand" : "Collapse"}</Badge>
                  </button>

                  {!isCollapsed ? (
                    <div className="grid gap-3 border-t border-[var(--color-border)] p-4 md:grid-cols-2 xl:grid-cols-3">
                      {facultyProgrammes.map((programme) => {
                        const years = yearTokens(programme.yearLevels);

                        return (
                          <Card key={programme.id} className="border-[var(--color-border)] shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(0,32,80,0.08)]">
                            <CardBody className="space-y-4 p-4">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-semibold tracking-tight">{programme.programmeName}</h4>
                                  <Badge tone="neutral" outlined>
                                    {programme.programmeCode}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  {programme.degreeName ?? "Degree not set"} · {programme.qualificationType ?? "Qualification not set"}
                                </CardDescription>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Duration</div>
                                  <div className="mt-1 text-base font-semibold">
                                    {programme.durationYears ?? "—"} year{programme.durationYears === 1 ? "" : "s"}
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Modules</div>
                                  <div className="mt-1 text-base font-semibold">{programme._count.courseModules}</div>
                                </div>
                                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Credits</div>
                                  <div className="mt-1 text-base font-semibold">{programme.programmeCredits ?? "—"}</div>
                                </div>
                                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Level</div>
                                  <div className="mt-1 text-base font-semibold">{programme.academicLevel ?? "—"}</div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Badge tone={detailTone(programme.academicLevel)} outlined>
                                  {programme.academicLevel ?? "Unspecified"}
                                </Badge>
                                {years.map((year) => (
                                  <Badge key={year} tone="neutral" outlined>
                                    {year}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-2 pt-1">
                                <Link
                                  href={`/admin/programmes/${programme.id}`}
                                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] px-3 py-2 text-xs font-medium text-[var(--color-brand-foreground)] transition-colors hover:bg-[var(--color-brand-strong)]"
                                >
                                  Open
                                </Link>
                                <span className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)]">
                                  {programme.faculty.code}
                                </span>
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
                Explorer notes
              </p>
              <h3 className="text-xl font-semibold tracking-tight">Built for curriculum scanning</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                This page highlights curriculum structure first, then lets users open a programme when they need the full record.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
              <p className="font-medium">What to test</p>
              <ul className="space-y-2 text-[var(--color-text-muted)]">
                <li>Search by programme name, code, faculty, degree, or qualification.</li>
                <li>Switch faculties from the chip row.</li>
                <li>Collapse a faculty section and reopen it.</li>
                <li>Open a programme record from its card.</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
