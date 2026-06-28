import test from "node:test";
import assert from "node:assert/strict";

import { isAdminNavItemActive, normalizeAdminPathname } from "@/lib/admin-nav";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Faculties", href: "/admin/faculties" },
  { label: "ASC Coaches", href: "/admin/coaches" },
  { label: "Programmes", href: "/admin/programmes" },
  { label: "Course Modules", href: "/admin/course-modules" },
  { label: "Resources", href: "/admin/resources" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Analytics", href: "/admin/health" },
  { label: "Imports", href: "/admin/imports" },
];

test("normalizeAdminPathname trims trailing slashes and query strings", () => {
  assert.equal(normalizeAdminPathname("/admin/coaches/?q=kim"), "/admin/coaches");
  assert.equal(normalizeAdminPathname("/"), "/admin");
});

test("only the matching overview item is active on the admin root", () => {
  const active = navItems.filter((item) => isAdminNavItemActive(item.href, "/admin"));
  assert.deepEqual(active.map((item) => item.label), ["Overview"]);
});

test("only one sidebar item is active for nested routes", () => {
  const cases = [
    { pathname: "/admin/faculties/123", label: "Faculties" },
    { pathname: "/admin/coaches/123", label: "ASC Coaches" },
    { pathname: "/admin/programmes/123", label: "Programmes" },
    { pathname: "/admin/course-modules/123", label: "Course Modules" },
    { pathname: "/admin/resources/123", label: "Resources" },
    { pathname: "/admin/faqs/123", label: "FAQs" },
    { pathname: "/admin/health", label: "Analytics" },
    { pathname: "/admin/imports", label: "Imports" },
  ];

  for (const testCase of cases) {
    const active = navItems.filter((item) => isAdminNavItemActive(item.href, testCase.pathname));
    assert.deepEqual(active.map((item) => item.label), [testCase.label], testCase.pathname);
  }
});

test("overview is not highlighted for other admin routes", () => {
  assert.equal(isAdminNavItemActive("/admin", "/admin/search"), false);
  assert.equal(isAdminNavItemActive("/admin", "/admin/coaches/abc"), false);
});
