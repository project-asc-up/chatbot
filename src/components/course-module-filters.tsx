"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ActionButton, Field, Select, TextInput } from "@/components/admin-form";
import { displayFacultyName } from "@/lib/faculty-display";
import {
  buildCourseModuleFacultyOptions,
  buildCourseModuleProgrammeOptions,
  type CourseModuleProgrammeOption,
} from "@/lib/course-module-filters";

function buildUrl(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function CourseModuleFilters({
  query,
  facultyId,
  programmeId,
  programmes,
}: {
  query: string;
  facultyId: string;
  programmeId: string;
  programmes: CourseModuleProgrammeOption[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(query);

  const facultyOptions = useMemo(() => buildCourseModuleFacultyOptions(programmes), [programmes]);

  const programmeOptions = useMemo(() => {
    return buildCourseModuleProgrammeOptions(programmes, facultyId);
  }, [facultyId, programmes]);

  const currentFacultyId = useMemo(() => {
    if (programmeId && programmeId !== "all") {
      const selectedProgramme = programmes.find((programme) => programme.id === programmeId);
      if (selectedProgramme) return selectedProgramme.faculty.id;
    }
    return facultyId || "all";
  }, [facultyId, programmeId, programmes]);

  function updateParams(nextValues: Partial<{ q: string; facultyId: string; programmeId: string }>) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValues.q !== undefined) {
      if (nextValues.q.trim()) params.set("q", nextValues.q.trim());
      else params.delete("q");
      params.set("page", "1");
    }

    if (nextValues.facultyId !== undefined) {
      if (nextValues.facultyId === "all") params.delete("facultyId");
      else params.set("facultyId", nextValues.facultyId);
      params.set("page", "1");
    }

    if (nextValues.programmeId !== undefined) {
      if (nextValues.programmeId === "all") params.delete("programmeId");
      else params.set("programmeId", nextValues.programmeId);
      params.set("page", "1");
    }

    startTransition(() => {
      router.replace(buildUrl(pathname, params), { scroll: false });
    });
  }

  function handleFacultyChange(nextFacultyId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFacultyId === "all") params.delete("facultyId");
    else params.set("facultyId", nextFacultyId);

    params.delete("programmeId");

    params.set("page", "1");
    startTransition(() => {
      router.replace(buildUrl(pathname, params), { scroll: false });
    });
  }

  function handleProgrammeChange(nextProgrammeId: string) {
    if (nextProgrammeId === "all") {
      updateParams({ programmeId: "all", facultyId: "all" });
      return;
    }

    const selectedProgramme = programmes.find((programme) => programme.id === nextProgrammeId);
    if (!selectedProgramme) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("programmeId", nextProgrammeId);
    params.set("facultyId", selectedProgramme.faculty.id);
    params.set("page", "1");

    startTransition(() => {
      router.replace(buildUrl(pathname, params), { scroll: false });
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.7fr))_auto]">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[color:var(--color-primary-dark)]">Search modules</span>
          <span className="text-xs text-[color:var(--color-text-muted)]">Module code, module name, programme code, or programme name</span>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateParams({ q: searchText });
          }}
          className="space-y-3"
        >
          <TextInput
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search modules"
          />
          <div className="flex items-center gap-2">
            <ActionButton type="submit" disabled={isPending}>
              Search
            </ActionButton>
          </div>
        </form>
      </div>

      <Field label="Faculty" hint="All or a specific faculty">
        <Select
          value={currentFacultyId}
          onChange={(event) => handleFacultyChange(event.target.value)}
        >
          <option value="all">All faculties</option>
          {facultyOptions.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {displayFacultyName(faculty.name)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Programme" hint="Updated from the faculty selection">
        <Select
          value={programmeId && programmeId !== "all" ? programmeId : "all"}
          onChange={(event) => handleProgrammeChange(event.target.value)}
        >
          <option value="all">All programmes</option>
          {programmeOptions.map((programme) => (
            <option key={programme.id} value={programme.id}>
              {programme.programmeCode} - {programme.programmeName}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams();
            router.replace(buildUrl(pathname, params), { scroll: false });
          }}
          className="rounded-full border border-[color:var(--color-border)] px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-light)]"
        >
          Reset all
        </button>
      </div>
    </div>
  );
}
