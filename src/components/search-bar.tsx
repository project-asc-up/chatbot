"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { LiveSearchInput } from "@/components/live-search-input";
import type { SearchSuggestion } from "@/lib/search-suggestions";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const loadSuggestions = useCallback(async (value: string) => {
    const response = await fetch(`/api/admin/search-suggestions?q=${encodeURIComponent(value)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as { suggestions?: SearchSuggestion[] };
    return payload.suggestions ?? [];
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (query.trim()) {
          router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
        }
      }}
      className="hidden sm:block"
    >
      <LiveSearchInput
        value={query}
        onValueChange={setQuery}
        suggestionsLoader={loadSuggestions}
        placeholder="Search across all tables..."
        inputClassName="pr-4"
      />
    </form>
  );
}
