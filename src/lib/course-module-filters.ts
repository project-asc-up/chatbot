import { displayFacultyName } from "@/lib/faculty-display";

export type CourseModuleProgrammeOption = {
  id: string;
  programmeCode: string;
  programmeName: string;
  faculty: {
    id: string;
    name: string;
    code: string;
  };
};

export function buildCourseModuleFacultyOptions(programmes: CourseModuleProgrammeOption[]) {
  return Array.from(new Map(programmes.map((programme) => [programme.faculty.id, programme.faculty])).values()).sort(
    (a, b) => displayFacultyName(a.name).localeCompare(displayFacultyName(b.name)),
  );
}

export function buildCourseModuleProgrammeOptions(
  programmes: CourseModuleProgrammeOption[],
  facultyId: string,
) {
  const filtered =
    facultyId !== "all"
      ? programmes.filter((programme) => programme.faculty.id === facultyId)
      : programmes;

  return [...filtered].sort((a, b) => a.programmeName.localeCompare(b.programmeName));
}
