import * as React from "react";
import { cn } from "@/lib/cn";

const fieldBlock =
  "block w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-colors hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(fieldBlock, className)}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBlock, "min-h-24 resize-y leading-relaxed", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        fieldBlock,
        "appearance-none pr-9 bg-[length:16px] bg-no-repeat bg-[right_0.625rem_center]",
        // Inline chevron as data-uri fallback — ring keeps the field usable.
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, label, id, ...props }, ref) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-2.5 text-sm text-[var(--color-text)] cursor-pointer select-none",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded-[var(--radius-sm)] border-[var(--color-border-strong)]",
            "text-[var(--color-brand)] accent-[var(--color-brand)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)]"
          )}
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    );
  }
);
