import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Use this everywhere instead of template-string concatenation so
 * later classes win over earlier ones (`px-4 px-2` -> `px-2`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
