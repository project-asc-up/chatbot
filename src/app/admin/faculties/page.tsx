import Link from "next/link";

import { PageHeader, Section } from "@/components/admin-form";
import { CreateFacultyModal } from "@/components/create-faculty-modal";
import { getFacultyRows } from "@/lib/admin-queries";

function formatDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "Not set";
}

export default async function FacultiesPage() {
  const faculties = await getFacultyRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Phase 2"
        title="Faculties"
        description="Manage the master faculty records that drive coach, programme, resource, and FAQ relationships."
        action={<CreateFacultyModal />}
      />

      <Section title="Faculty directory" description="Current faculty records with linked content counts.">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                <th className="border-b border-[color:var(--color-border)] px-4 py-4 font-semibold">Faculty</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-4 font-semibold">Code</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-4 font-semibold">Status</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-4 font-semibold">Linked content</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-4 font-semibold">Verified</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr 
                  key={faculty.id} 
                  className="align-top transition-smooth border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-bg-light)]"
                >
                  <td className="px-4 py-5">
                    <div className="font-semibold text-[color:var(--color-primary-dark)]">{faculty.name}</div>
                    {faculty.aliases ? (
                      <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{faculty.aliases}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-5">
                    <span className="inline-flex rounded-full bg-[color:var(--color-primary)] px-3 py-1 text-sm font-semibold text-white">
                      {faculty.code}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      faculty.codeStatus === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : faculty.codeStatus === 'review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {faculty.codeStatus}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-[color:var(--color-text-muted)]">
                    <div className="space-y-1">
                      <div>Coaches <span className="font-semibold">{faculty._count.ascCoaches}</span></div>
                      <div>Programmes <span className="font-semibold">{faculty._count.programmes}</span></div>
                      <div>Resources <span className="font-semibold">{faculty._count.resources}</span></div>
                      <div>FAQs <span className="font-semibold">{faculty._count.faqs}</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm text-[color:var(--color-text-muted)]">
                    {formatDate(faculty.lastVerified)}
                  </td>
                  <td className="px-4 py-5 text-right">
                    <Link
                      href={`/admin/faculties/${faculty.id}`}
                      className="inline-flex rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] transition-smooth hover-lift hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-light)]"
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
