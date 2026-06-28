import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  buildCourseModuleFacultyOptions,
  buildCourseModuleProgrammeOptions,
} from "@/lib/course-module-filters";
import {
  buildResourceFacultyOptions,
  filterResourcesByFaculty,
} from "@/lib/resource-filters";

const programmes = [
  {
    id: "1",
    programmeCode: "EMS101",
    programmeName: "Economics",
    faculty: { id: "ems", name: "Faculty of Economic and Management Sciences", code: "EMS" },
  },
  {
    id: "2",
    programmeCode: "VET201",
    programmeName: "Veterinary Science",
    faculty: { id: "vet", name: "Faculty of Veterinary Sciences", code: "VET" },
  },
  {
    id: "3",
    programmeCode: "EMS102",
    programmeName: "Business Science",
    faculty: { id: "ems", name: "Faculty of Economic and Management Sciences", code: "EMS" },
  },
];

const resources = [
  { id: "r1", title: "Study Skills", faculty: null },
  { id: "r2", title: "Vet Guide", faculty: { id: "vet", name: "Faculty of Veterinary Sciences", code: "VET" } },
  { id: "r3", title: "EMS Guide", faculty: { id: "ems", name: "Faculty of Economic and Management Sciences", code: "EMS" } },
];

function readSourceFile(pathFromRoot: string) {
  return readFileSync(join(process.cwd(), pathFromRoot), "utf8");
}

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) return listSourceFiles(path);
    if (/\.(ts|tsx|css)$/.test(entry)) return [path];
    return [];
  });
}

test("course module faculty options are deduplicated and sorted", () => {
  const options = buildCourseModuleFacultyOptions(programmes);
  assert.deepEqual(options.map((option) => option.code), ["EMS", "VET"]);
});

test("course module programme options cascade by faculty", () => {
  const emsOnly = buildCourseModuleProgrammeOptions(programmes, "ems");
  assert.deepEqual(emsOnly.map((programme) => programme.programmeCode), ["EMS102", "EMS101"]);

  const allProgrammes = buildCourseModuleProgrammeOptions(programmes, "all");
  assert.equal(allProgrammes.length, 3);
});

test("resource faculty filtering keeps all resources for all faculties", () => {
  const facultyOptions = buildResourceFacultyOptions(resources);
  assert.deepEqual(facultyOptions.map((faculty) => faculty.code), ["EMS", "VET"]);

  const filtered = filterResourcesByFaculty(resources, "vet");
  assert.deepEqual(filtered.map((resource) => resource.title), ["Vet Guide"]);

  const all = filterResourcesByFaculty(resources, "all");
  assert.equal(all.length, 3);
});

test("course module filters do not render a Clear control", () => {
  const source = readSourceFile("src/components/course-module-filters.tsx");

  assert.doesNotMatch(source, />\s*Clear\s*</);
});

test("application source uses the Academic Success Coaches product name", () => {
  const sourceFiles = listSourceFiles(join(process.cwd(), "src"));
  const oldProductName = ["Project", "ASC"].join(" ");
  const matches = sourceFiles.filter((path) => readFileSync(path, "utf8").includes(oldProductName));

  assert.deepEqual(matches, []);
});
