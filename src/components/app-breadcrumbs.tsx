import * as React from "react";
import Link from "next/link";
import { ChevronRight, House } from "lucide-react";
import { cn } from "@/lib/cn";

export type Crumb = {
  label: string;
  href: string;
  /** Mark the last crumb as current (gets aria-current, no link). */
  current?: boolean;
};

/**
 * Compact breadcrumb bar. Renders inside the page header on every
 * admin page. Last crumb is non-interactive and marks the current
 * route. Hidden on narrow screens when there's only one crumb.
 */
export function AppBreadcrumbs({
  crumbs,
  className,
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex min-w-0 items-center gap-1.5 text-sm", className)}
    >
      <ol className="flex min-w-0 items-center gap-1.5">
        {crumbs.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === crumbs.length - 1;
          return (
            <li
              key={`${crumb.href}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {!isFirst ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[var(--color-text-subtle)]"
                />
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className="truncate font-medium text-[var(--color-text)]"
                  title={crumb.label}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn(
                    "flex items-center gap-1 truncate rounded-[var(--radius-sm)]",
                    "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)]"
                  )}
                  title={crumb.label}
                >
                  {isFirst ? (
                    <House aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : null}
                  <span className="truncate">{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
