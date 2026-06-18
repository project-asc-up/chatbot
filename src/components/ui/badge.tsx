import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-[var(--radius-full)]",
    "px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  ],
  {
    variants: {
      tone: {
        neutral:
          "bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
        brand:
          "bg-[var(--color-brand-soft)] text-[var(--color-brand-soft-foreground)]",
        accent:
          "bg-[var(--color-accent)]/15 text-[var(--color-accent-foreground)]",
        success:
          "bg-[var(--color-success-soft)] text-[var(--color-success-foreground)]",
        warning:
          "bg-[var(--color-warning-soft)] text-[var(--color-warning-foreground)]",
        danger:
          "bg-[var(--color-danger-soft)] text-[var(--color-danger-foreground)]",
        info: "bg-[var(--color-info-soft)] text-[var(--color-info-foreground)]",
      },
      outlined: {
        true: "border",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      outlined: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, outlined, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone, outlined }), className)}
      {...props}
    />
  );
}
