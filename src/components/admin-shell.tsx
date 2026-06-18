import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookOpen, HelpCircle, Link as LinkIcon, Settings, Users, BookMarked, Upload, Home, Search, SunMedium } from "lucide-react";
import { AppBreadcrumbs, type Crumb } from "@/components/app-breadcrumbs";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: <Home size={18} /> },
  { label: "Faculties", href: "/admin/faculties", icon: <Settings size={18} /> },
  { label: "ASC Coaches", href: "/admin/coaches", icon: <Users size={18} /> },
  { label: "Programmes", href: "/admin/programmes", icon: <BookMarked size={18} /> },
  { label: "Course Modules", href: "/admin/course-modules", icon: <BookOpen size={18} /> },
  { label: "Resources", href: "/admin/resources", icon: <LinkIcon size={18} /> },
  { label: "FAQs", href: "/admin/faqs", icon: <HelpCircle size={18} /> },
  { label: "Analytics", href: "/admin/health", icon: <BarChart3 size={18} /> },
  { label: "Imports", href: "/admin/imports", icon: <Upload size={18} /> },
];

/**
 * Resolves the segment path inside `/admin` to a list of breadcrumb
 * crumbs. We use a hand-curated label map rather than per-page
 * `usePathname` so this stays a server component (no client bundle
 * bloat from a 20-line shell).
 *
 * URLs that aren't matched explicitly fall back to the last segment
 * title-cased, which keeps unwired paths from rendering "[object]".
 */
function buildCrumbs(pathname: string): Crumb[] {
  const labels: Record<string, string> = {
    admin: "Admin",
    faculties: "Faculties",
    coaches: "ASC Coaches",
    programmes: "Programmes",
    "course-modules": "Course Modules",
    resources: "Resources",
    faqs: "FAQs",
    health: "Analytics",
    imports: "Imports",
    search: "Search",
  };

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "admin") return [];

  const crumbs: Crumb[] = [{ label: "Admin", href: "/admin" }];

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const label = labels[segment] ?? toTitle(segment);
    const href = `/${segments.slice(0, i + 1).join("/")}`;
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href, current: isLast });
  }

  return crumbs;
}

function toTitle(segment: string) {
  // Replace dashes/camelCase with spaces, then title-case first letter.
  const spaced = segment.replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export async function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `next/headers` lets us read the current pathname from a server
  // component without forcing a client-side `usePathname`. We pull the
  // value from the `x-pathname` header (set by the proxy middleware) or
  // fall back to the canonical /admin if it's unavailable.
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || headerStore.get("x-invoke-path") || "/admin";
  const crumbs = buildCrumbs(pathname);
  const isActive = (href: string) => pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--color-surface-raised)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-brand)] focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-raised)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--color-border)] px-5 py-5">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-raised)]"
            >
              <Image
                src="/up-logo.png"
                alt="University of Pretoria logo"
                width={40}
                height={40}
                className="h-9 w-9 flex-shrink-0 rounded-[var(--radius-sm)] object-contain"
                priority
              />
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-semibold tracking-tight text-[var(--color-text)]">
                  Project ASC
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Content workspace
                </p>
              </div>
            </Link>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-2.5 py-4"
            aria-label="Primary"
          >
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={[
                      "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-raised)]",
                      isActive(item.href)
                        ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[var(--color-brand)] transition-opacity duration-150",
                        isActive(item.href) ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                    {item.icon ? (
                      <span
                        aria-hidden="true"
                        className={[
                          "flex h-4 w-4 flex-shrink-0 items-center justify-center transition-colors",
                          isActive(item.href)
                            ? "text-[var(--color-brand)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
              <SunMedium size={14} aria-hidden="true" />
              Browser theme preference
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface-overlay)] px-5 backdrop-blur-sm sm:px-8">
            <div className="min-w-0 flex-1">
              <AppBreadcrumbs crumbs={crumbs} />
            </div>
            <form action="/admin/search" method="get" className="hidden sm:block">
              <div className="relative flex items-center">
                <input
                  type="search"
                  name="q"
                  placeholder="Search across all tables..."
                  className="rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 pl-10 text-sm font-medium text-[color:var(--color-text)] placeholder-[color:var(--color-text-muted)] transition-smooth hover:border-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[color:var(--color-text-muted)]" size={16} />
              </div>
            </form>
          </header>

          <main
            id="main-content"
            className="flex-1 px-5 py-6 sm:px-8 lg:px-10"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
