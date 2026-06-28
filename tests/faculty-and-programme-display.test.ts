import test from "node:test";
import assert from "node:assert/strict";

import { displayFacultyName } from "@/lib/faculty-display";
import {
  filterProgrammeExplorerRows,
  getProgrammeExplorerStats,
  groupProgrammeExplorerRows,
} from "@/lib/programme-explorer";

test("faculty names are abbreviated for the coach UI", () => {
  assert.equal(
    displayFacultyName("Faculty of Economic and Management Sciences"),
    "EMS",
  );
  assert.equal(displayFacultyName("Faculty of Education"), "EDU");
  assert.equal(displayFacultyName("Gordon Institute of Business Science"), "GIBS");
  assert.equal(displayFacultyName("Faculty of Veterinary Sciences"), "VET");
  assert.equal(displayFacultyName("Faculty of Veterinary Science"), "VET");
  assert.equal(displayFacultyName("General"), "General");
});

test("programme explorer filters and stats stay in sync with faculty selection", () => {
  const programmes = [
    {
      id: "1",
      programmeCode: "EMS101",
      programmeName: "Economics 101",
      degreeName: "BCom",
      academicLevel: "Undergraduate",
      qualificationType: "Degree",
      durationYears: 3,
      programmeCredits: 360,
      yearLevels: "1;2;3",
      faculty: { id: "ems", name: "Faculty of Economic and Management Sciences", code: "EMS" },
      _count: { courseModules: 4 },
    },
    {
      id: "2",
      programmeCode: "EDU201",
      programmeName: "Education Studies",
      degreeName: "BEd",
      academicLevel: "Undergraduate",
      qualificationType: "Degree",
      durationYears: 4,
      programmeCredits: 480,
      yearLevels: "1;2;3;4",
      faculty: { id: "edu", name: "Faculty of Education", code: "EDU" },
      _count: { courseModules: 6 },
    },
  ];

  const filtered = filterProgrammeExplorerRows(programmes, "education", "edu");

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "2");

  const grouped = groupProgrammeExplorerRows(filtered);
  assert.equal(grouped.length, 1);
  assert.equal(grouped[0]?.faculty.id, "edu");
  assert.equal(grouped[0]?.programmes.length, 1);

  const stats = getProgrammeExplorerStats(filtered);
  assert.equal(stats.totalModules, 6);
  assert.equal(stats.withDuration, 1);
  assert.equal(stats.withYearLevels, 1);
});

test("programme explorer resets back to the full faculty slice when filter is cleared", () => {
  const programmes = [
    {
      id: "1",
      programmeCode: "EMS101",
      programmeName: "Economics 101",
      degreeName: "BCom",
      academicLevel: "Undergraduate",
      qualificationType: "Degree",
      durationYears: 3,
      programmeCredits: 360,
      yearLevels: "1;2;3",
      faculty: { id: "ems", name: "Faculty of Economic and Management Sciences", code: "EMS" },
      _count: { courseModules: 4 },
    },
    {
      id: "2",
      programmeCode: "EDU201",
      programmeName: "Education Studies",
      degreeName: "BEd",
      academicLevel: "Undergraduate",
      qualificationType: "Degree",
      durationYears: 4,
      programmeCredits: 480,
      yearLevels: "1;2;3;4",
      faculty: { id: "edu", name: "Faculty of Education", code: "EDU" },
      _count: { courseModules: 6 },
    },
  ];

  const filtered = filterProgrammeExplorerRows(programmes, "", "all");
  const stats = getProgrammeExplorerStats(filtered);

  assert.equal(filtered.length, 2);
  assert.equal(stats.totalModules, 10);
  assert.equal(stats.withDuration, 2);
  assert.equal(stats.withYearLevels, 2);
});
