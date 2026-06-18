import Link from "next/link";

import { PageHeader, Section, Field, TextInput, ActionButton } from "@/components/admin-form";
import { CreateCourseModuleModal } from "@/components/create-course-module-modal";
import { CourseModuleAtlas } from "@/components/course-module-atlas";
import { getCourseModulePage, getProgrammeRows } from "@/lib/admin-queries";

export default async function CourseModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const pageSize = 50;
  const currentPage = Math.max(Number(page ?? "1") || 1, 1);
  const [pageData, programmes] = await Promise.all([
    getCourseModulePage({ query: q, page: currentPage, pageSize }),
    getProgrammeRows(),
  ]);

  const totalPages = Math.max(Math.ceil(pageData.total / pageSize), 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Modules"
        description="Browse curriculum rows as grouped module cards, keeping the programme context visible."
        action={<CreateCourseModuleModal programmes={programmes} />}
      />

      <Section title="Search modules" description="Filter by module code, name, or programme context.">
        <form className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <Field label="Search" hint="Module code, module name, programme code, or programme name">
            <TextInput name="q" defaultValue={q ?? ""} placeholder="Search modules" />
          </Field>
          <div className="flex items-end">
            <ActionButton type="submit">Search</ActionButton>
          </div>
        </form>
      </Section>

      <Section
        title={`Module atlas ${pageData.total > 0 ? `(${pageData.total})` : ""}`}
        description="Grouped card view for the current slice of curriculum data."
      >
        <CourseModuleAtlas
          rows={pageData.rows}
          total={pageData.total}
          currentPage={currentPage}
          totalPages={totalPages}
          query={q}
        />

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--color-text-muted)]">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/course-modules?page=${Math.max(currentPage - 1, 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full border px-4 py-2 font-semibold ${
                currentPage <= 1
                  ? "pointer-events-none border-[color:var(--color-border)] text-[color:var(--color-text-muted)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-primary)]"
              }`}
            >
              Previous
            </Link>
            <Link
              href={`/admin/course-modules?page=${Math.min(currentPage + 1, totalPages)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full border px-4 py-2 font-semibold ${
                currentPage >= totalPages
                  ? "pointer-events-none border-[color:var(--color-border)] text-[color:var(--color-text-muted)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-primary)]"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
