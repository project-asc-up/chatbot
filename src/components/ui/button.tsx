import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  // Base — applied to every variant. Focus ring, transition, disabled state.
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-md)] font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-strong)] shadow-sm",
        secondary:
          "bg-[var(--color-surface-raised)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)]",
        ghost:
          "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]",
        danger:
          "bg-[var(--color-danger)] text-[var(--color-danger-foreground)] hover:opacity-90 shadow-sm",
        outline:
          "bg-transparent text-[var(--color-brand)] border border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-soft-foreground)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, loading, disabled, children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        {children}
      </button>
    );
  }
);

export { buttonVariants };
