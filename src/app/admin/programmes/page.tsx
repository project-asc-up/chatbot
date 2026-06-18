import { PageHeader, Section } from "@/components/admin-form";
import { CreateProgrammeModal } from "@/components/create-programme-modal";
import { ProgrammeExplorer } from "@/components/programme-explorer";
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
        <ProgrammeExplorer programmes={programmes} />
      </Section>
    </div>
  );
}
