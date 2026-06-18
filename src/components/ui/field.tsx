import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Form field with optional label, hint, and error message.
 * Wire-up:
 *   <Field label="Email" hint="We'll never share">
 *     <Input id="email" name="email" />
 *   </Field>
 */
export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
}: FieldProps) {
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
  const reactId = React.useId();
  const id = htmlFor ?? reactId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="flex items-center justify-between gap-2 text-sm font-medium text-[var(--color-text)]"
        >
          <span>
            {label}
            {required ? (
              <span
                aria-hidden="true"
                className="ml-1 text-[var(--color-danger)]"
              >
                *
              </span>
            ) : null}
          </span>
          {hint ? (
            <span
              id={hintId}
              className="text-xs font-normal text-[var(--color-text-subtle)]"
            >
              {hint}
            </span>
          ) : null}
        </label>
      ) : null}
      {/* Inject id and aria attributes when children are not controlled */}
      <FieldChildSlot id={id} ariaDescribedBy={hintId} hasError={!!error}>
        {children}
      </FieldChildSlot>
      {error ? (
        <p
          role="alert"
          className="text-xs text-[var(--color-danger)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldChildSlot({
  id,
  ariaDescribedBy,
  hasError,
  children,
}: {
  id: string;
  ariaDescribedBy?: string;
  hasError: boolean;
  children: React.ReactNode;
}) {
  // If a single child element is passed and not yet given an id/aria,
  // patch it. Otherwise render the children as-is.
  const child = React.Children.only(children);
  if (!React.isValidElement(child)) return <>{children}</>;

  const existing = (child.props ?? {}) as {
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  };

  // Don't overwrite props the consumer already set.
  const nextId = existing.id ?? id;
  const nextAria = existing["aria-describedby"] ?? ariaDescribedBy;
  const nextInvalid = existing["aria-invalid"] ?? hasError;

  return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
    id: nextId,
    "aria-describedby": nextAria,
    "aria-invalid": nextInvalid || undefined,
  });
}
