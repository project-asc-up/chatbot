export type DisplayDateValue = Date | string | null | undefined;

export function formatIsoDate(value: DisplayDateValue, fallback = "") {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toISOString().slice(0, 10);
}

export function formatReadableDate(value: DisplayDateValue, fallback = "Unverified") {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-ZA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
