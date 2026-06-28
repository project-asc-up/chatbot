import test from "node:test";
import assert from "node:assert/strict";

import { rankSuggestions } from "@/lib/search-suggestions";

test("rankSuggestions prioritizes exact and prefix matches", () => {
  const results = rankSuggestions(
    "kim",
    [
      {
        id: "1",
        title: "Kim Smith",
        value: "Kim Smith",
        detail: "kim.smith@up.ac.za",
        badge: "Coach",
        searchText: "kim smith kim.smith@up.ac.za",
      },
      {
        id: "2",
        title: "M. Kimmel",
        value: "M. Kimmel",
        detail: "mkimmel@up.ac.za",
        badge: "Coach",
        searchText: "m kimmel mkimmel@up.ac.za",
      },
    ],
    2,
  );

  assert.equal(results[0]?.id, "1");
  assert.equal(results[1]?.id, "2");
});
