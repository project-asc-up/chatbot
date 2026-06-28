export type SearchSuggestion = {
  id: string;
  title: string;
  value: string;
  detail?: string;
  badge?: string;
  href?: string;
  searchText?: string;
};

export function normalizeSearchText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function splitTokens(value: string) {
  return value
    .split(/[\s._@+-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreSuggestion(query: string, suggestion: SearchSuggestion) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const searchableText = normalizeSearchText(suggestion.searchText ?? `${suggestion.title} ${suggestion.detail ?? ""} ${suggestion.badge ?? ""}`);
  const tokens = splitTokens(normalizedQuery);
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const title = normalizeSearchText(suggestion.title);
  const value = normalizeSearchText(suggestion.value);
  const detail = normalizeSearchText(suggestion.detail);
  const badge = normalizeSearchText(suggestion.badge);

  let score = 0;

  if (value === normalizedQuery) score += 140;
  if (value.startsWith(normalizedQuery)) score += 120;
  if (title === normalizedQuery) score += 110;
  if (title.startsWith(normalizedQuery)) score += 95;
  if (detail.startsWith(normalizedQuery)) score += 75;
  if (badge.startsWith(normalizedQuery)) score += 60;
  if (searchableText.includes(compactQuery)) score += 40;
  if (tokens.every((token) => searchableText.includes(token))) score += 20;

  return score;
}

export function rankSuggestions(query: string, suggestions: SearchSuggestion[], limit = 6) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  return suggestions
    .map((suggestion) => ({
      ...suggestion,
      score: scoreSuggestion(normalizedQuery, suggestion),
    }))
    .filter((suggestion) => suggestion.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
