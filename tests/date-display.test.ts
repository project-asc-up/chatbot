import test from "node:test";
import assert from "node:assert/strict";

import { formatIsoDate, formatReadableDate } from "@/lib/date-display";

test("formatIsoDate accepts Date and serialized date values", () => {
  assert.equal(formatIsoDate(new Date("2026-06-28T10:30:00.000Z")), "2026-06-28");
  assert.equal(formatIsoDate("2026-06-28T10:30:00.000Z"), "2026-06-28");
});

test("formatIsoDate returns fallback for missing or invalid values", () => {
  assert.equal(formatIsoDate(null, "Not set"), "Not set");
  assert.equal(formatIsoDate("not-a-date", "Not set"), "Not set");
});

test("formatReadableDate accepts serialized date values", () => {
  assert.match(formatReadableDate("2026-06-28T10:30:00.000Z"), /2026/);
  assert.equal(formatReadableDate(undefined), "Unverified");
});
