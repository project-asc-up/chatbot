import { displayFacultyName } from "@/lib/faculty-display";

export function buildResourceFacultyOptions<
  T extends { faculty: { id: string; name: string; code: string } | null },
>(resources: T[]) {
  return Array.from(
    new Map(
      resources
        .filter((resource): resource is T & { faculty: NonNullable<T["faculty"]> } => Boolean(resource.faculty))
        .map((resource) => [resource.faculty.id, resource.faculty]),
    ).values(),
  ).sort((a, b) => displayFacultyName(a.name).localeCompare(displayFacultyName(b.name)));
}

export function filterResourcesByFaculty<T extends { faculty: { id: string; name: string; code: string } | null }>(
  resources: T[],
  facultyId: string,
) {
  if (facultyId === "all") return resources;
  return resources.filter((resource) => resource.faculty?.id === facultyId);
}
