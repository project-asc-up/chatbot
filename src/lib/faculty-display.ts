const facultyAbbreviations: Record<string, string> = Object.fromEntries(
  [
    ["Faculty of Economic and Management Sciences", "EMS"],
    ["Faculty of Education", "EDU"],
    ["Gordon Institute of Business Science", "GIBS"],
    ["Faculty of Natural and Agricultural Sciences", "NAS"],
    ["Faculty of Engineering, Built Environment and Information Technology", "EBIT"],
    ["Faculty of Health Sciences", "HEALTH"],
    ["Faculty of Humanities", "HUM"],
    ["Faculty of Law", "LAW"],
    ["Faculty of Veterinary Science", "VET"],
    ["Faculty of Veterinary Sciences", "VET"],
    ["Faculty of Theology and Religion", "THEO"],
  ].map(([name, abbreviation]) => [normalizeFacultyName(name), abbreviation]),
);

function normalizeFacultyName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function displayFacultyName(value: string) {
  return facultyAbbreviations[normalizeFacultyName(value)] ?? value;
}

export function displayFacultyOptions<T extends { name: string }>(faculties: T[]) {
  return faculties.map((faculty) => ({
    ...faculty,
    displayName: displayFacultyName(faculty.name),
  }));
}
