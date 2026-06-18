"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function AdminNavLink({
  href,
  children,
  icon,
}: Readonly<{
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Match the exact route for `/admin` and prefix-match for everything
  // else so `/admin/coaches/[id]` highlights the "ASC Coaches" item.
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-[var(--radius-md)]",
        "px-3 py-2.5 text-sm font-medium",
        // Subtle transition — works in both light and dark modes.
        "transition-colors duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-raised)]",
        isActive
          ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
      )}
    >
      {/* Left accent bar — only visible when active */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[var(--color-brand)]",
          "transition-opacity duration-150",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 flex-shrink-0 items-center justify-center transition-colors",
            isActive
              ? "text-[var(--color-brand)]"
              : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
    </Link>
  );
}
