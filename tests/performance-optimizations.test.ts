import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readProjectFile(pathFromRoot: string) {
  return readFileSync(join(process.cwd(), pathFromRoot), "utf8");
}

test("unused charting dependency stays out of the production dependency graph", () => {
  const packageJson = JSON.parse(readProjectFile("package.json")) as {
    dependencies?: Record<string, string>;
  };

  assert.equal(packageJson.dependencies?.recharts, undefined);
});

test("admin sidebar remains a server component driven by the server-resolved pathname", () => {
  const sidebarSource = readProjectFile("src/components/admin-sidebar-nav.tsx");
  const shellSource = readProjectFile("src/components/admin-shell.tsx");

  assert.doesNotMatch(sidebarSource, /["']use client["']/);
  assert.doesNotMatch(sidebarSource, /usePathname/);
  assert.match(sidebarSource, /pathname:\s*string/);
  assert.match(shellSource, /<AdminSidebarNav pathname=\{pathname\} \/>/);
});

test("admin search helpers use cached query functions with admin invalidation tags", () => {
  const querySource = readProjectFile("src/lib/admin-queries.ts");

  for (const helper of [
    "searchFacultyRowsCached",
    "searchCoachRowsCached",
    "searchProgrammeRowsCached",
    "searchResourceRowsCached",
    "searchFaqRowsCached",
    "searchCourseModuleRowsCached",
  ]) {
    assert.match(querySource, new RegExp(`const ${helper} = unstable_cache`));
  }

  assert.match(querySource, /ADMIN_CACHE_TAGS\.faculties/);
  assert.match(querySource, /ADMIN_CACHE_TAGS\.courseModules/);
  assert.match(querySource, /revalidate:\s*60/);
});

test("live search avoids unnecessary memoization for trivial derived text", () => {
  const liveSearchSource = readProjectFile("src/components/live-search-input.tsx");

  assert.doesNotMatch(liveSearchSource, /useMemo/);
});
