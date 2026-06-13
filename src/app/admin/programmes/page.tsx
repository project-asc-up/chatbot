import Link from "next/link";

import { PageHeader, Section } from "@/components/admin-form";
import { CreateProgrammeModal } from "@/components/create-programme-modal";
import { getFacultyOptions, getProgrammeRows } from "@/lib/admin-queries";

export default async function ProgrammesPage() {
  const [programmes, faculties] = await Promise.all([getProgrammeRows(), getFacultyOptions()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Programmes"
        description="Maintain programme master data, qualification details, and curriculum provenance."
        action={<CreateProgrammeModal faculties={faculties} />}
      />

      <Section title="Programme directory" description="Current programme records with linked module counts.">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Programme</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Faculty</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Qualification</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Duration</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Modules</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((programme) => (
                <tr key={programme.id} className="align-top">
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4">
                    <div className="font-semibold text-[color:var(--color-primary-dark)]">
                      {programme.programmeName}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                      {programme.programmeCode}
                    </div>
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm">
                    <div className="font-medium text-[color:var(--color-primary-dark)]">
                      {programme.faculty.code}
                    </div>
                    <div className="text-[color:var(--color-text-muted)]">{programme.faculty.name}</div>
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    <div>{programme.qualificationType ?? "Not set"}</div>
                    <div>{programme.academicLevel ?? ""}</div>
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    {programme.durationYears ?? "?"} years
                    <div>{programme.programmeCredits ?? "?"} credits</div>
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    {programme._count.courseModules}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-right">
                    <Link
                      href={`/admin/programmes/${programme.id}`}
                      className="inline-flex rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-primary)]"
                    >
                      View / edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
