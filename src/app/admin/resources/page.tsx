import Link from "next/link";

import { PageHeader, Section } from "@/components/admin-form";
import { CreateResourceModal } from "@/components/create-resource-modal";
import { getFacultyOptions, getResourceRows } from "@/lib/admin-queries";

export default async function ResourcesPage() {
  const [resources, faculties] = await Promise.all([getResourceRows(), getFacultyOptions()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        description="Manage general and faculty-specific support resources used by the bot and admin team."
        action={<CreateResourceModal faculties={faculties} />}
      />

      <Section title="Resource directory" description="Current support resources with faculty scope.">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Resource</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Category</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">Scope</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3">URL</th>
                <th className="border-b border-[color:var(--color-border)] px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="align-top">
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4">
                    <div className="font-semibold text-[color:var(--color-primary-dark)]">{resource.title}</div>
                    {resource.description ? (
                      <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{resource.description}</div>
                    ) : null}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    {resource.category}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    {resource.faculty ? `${resource.faculty.code} - ${resource.faculty.name}` : "General"}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-muted)]">
                    <a href={resource.url} target="_blank" rel="noreferrer" className="text-[color:var(--color-primary)]">
                      Open link
                    </a>
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 text-right">
                    <Link
                      href={`/admin/resources/${resource.id}`}
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
