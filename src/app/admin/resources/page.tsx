import { PageHeader, Section } from "@/components/admin-form";
import { CreateResourceModal } from "@/components/create-resource-modal";
import { ResourceExplorer } from "@/components/resource-explorer";
import { getFacultyOptions, getResourceRows } from "@/lib/admin-queries";

export default async function ResourcesPage() {
  const [resources, faculties] = await Promise.all([getResourceRows(), getFacultyOptions()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        description="Browse support links as grouped cards instead of a dense table."
        action={<CreateResourceModal faculties={faculties} />}
      />

      <Section title="Resource atlas" description="Scrollable cards grouped by faculty, with external links and verification status.">
        <ResourceExplorer resources={resources} />
      </Section>
    </div>
  );
}
