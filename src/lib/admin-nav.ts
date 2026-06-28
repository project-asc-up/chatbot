export type AdminNavItem = {
  label: string;
  href: string;
};

export function normalizeAdminPathname(pathname: string) {
  const stripped = pathname.split("?")[0] ?? pathname;
  return stripped === "/" ? "/admin" : stripped.replace(/\/+$/, "") || "/admin";
}

export function isAdminNavItemActive(href: string, pathname: string) {
  const currentPath = normalizeAdminPathname(pathname);
  if (href === "/admin") {
    return currentPath === "/admin";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}
