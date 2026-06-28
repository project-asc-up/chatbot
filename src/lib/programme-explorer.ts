export type ProgrammeExplorerFaculty = {
  id: string;
  name: string;
  code: string;
};

export type ProgrammeExplorerRow = {
  id: string;
  programmeCode: string;
  programmeName: string;
  degreeName: string | null;
  academicLevel: string | null;
  qualificationType: string | null;
  durationYears: number | null;
  programmeCredits: number | null;
  yearLevels: string | null;
  faculty: ProgrammeExplorerFaculty;
  _count: {
    courseModules: number;
  };
};

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export function filterProgrammeExplorerRows(
  programmes: ProgrammeExplorerRow[],
  query: string,
  facultyFilter: string,
) {
  const normalizedQuery = normalizeQuery(query);

  return programmes.filter((programme) => {
    const matchesQuery =
      !normalizedQuery ||
      programme.programmeName.toLowerCase().includes(normalizedQuery) ||
      programme.programmeCode.toLowerCase().includes(normalizedQuery) ||
      (programme.degreeName ?? "").toLowerCase().includes(normalizedQuery) ||
      (programme.qualificationType ?? "").toLowerCase().includes(normalizedQuery) ||
      programme.faculty.name.toLowerCase().includes(normalizedQuery) ||
      programme.faculty.code.toLowerCase().includes(normalizedQuery);

    const matchesFaculty = facultyFilter === "all" || programme.faculty.id === facultyFilter;
    return matchesQuery && matchesFaculty;
  });
}

export function groupProgrammeExplorerRows(programmes: ProgrammeExplorerRow[]) {
  const buckets = new Map<
    string,
    { faculty: ProgrammeExplorerFaculty; programmes: ProgrammeExplorerRow[] }
  >();

  for (const programme of programmes) {
    const bucket = buckets.get(programme.faculty.id);
    if (bucket) {
      bucket.programmes.push(programme);
    } else {
      buckets.set(programme.faculty.id, {
        faculty: programme.faculty,
        programmes: [programme],
      });
    }
  }

  return Array.from(buckets.values()).sort((a, b) =>
    a.faculty.name.localeCompare(b.faculty.name),
  );
}

export function getProgrammeExplorerStats(programmes: ProgrammeExplorerRow[]) {
  return {
    totalModules: programmes.reduce((sum, programme) => sum + programme._count.courseModules, 0),
    withDuration: programmes.filter((programme) => programme.durationYears !== null).length,
    withYearLevels: programmes.filter((programme) => Boolean(programme.yearLevels)).length,
  };
}
