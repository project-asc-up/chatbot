export type CoachSearchFaculty = {
  id: string;
  name: string;
  code: string;
};

export type CoachSearchRecord = {
  id: string;
  name: string;
  email: string;
  titleRole: string | null;
  cluster: string | null;
  isActive?: boolean;
  faculty: CoachSearchFaculty;
};

export type IndexedCoach = CoachSearchRecord & {
  searchText: string;
  nameParts: string[];
  emailParts: string[];
};

export type CoachSuggestion = {
  coach: CoachSearchRecord;
  score: number;
  matchLabel: string;
};

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function splitSearchTokens(value: string) {
  return value
    .split(/[\s._@+-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function hasSearchText(coach: CoachSearchRecord | IndexedCoach): coach is IndexedCoach {
  return "searchText" in coach;
}

export function indexCoach<T extends CoachSearchRecord>(coach: T): T & IndexedCoach {
  const nameParts = splitSearchTokens(coach.name.toLowerCase());
  const email = normalizeText(coach.email);
  const emailParts = splitSearchTokens(email);
  const searchText = [
    coach.name,
    coach.email,
    coach.titleRole,
    coach.cluster,
    coach.faculty.name,
    coach.faculty.code,
    ...nameParts,
    ...emailParts,
  ]
    .filter(Boolean)
    .map((part) => part!.toLowerCase())
    .join(" ");

  return {
    ...coach,
    searchText,
    nameParts,
    emailParts,
  };
}

export function coachMatchesQuery<T extends CoachSearchRecord | IndexedCoach>(coach: T, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const indexedCoach = hasSearchText(coach) ? coach : indexCoach(coach);
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => indexedCoach.searchText.includes(token));
}

function scoreCoachSuggestion(coach: IndexedCoach, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const firstToken = tokens[0] ?? normalizedQuery;
  const lastToken = tokens[tokens.length - 1] ?? firstToken;
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const name = coach.name.toLowerCase();
  const email = coach.email.toLowerCase();
  const emailLocalPart = email.split("@")[0] ?? email;
  const firstName = coach.nameParts[0] ?? name;
  const surname = coach.nameParts.length > 1 ? coach.nameParts[coach.nameParts.length - 1] : firstName;

  let score = 0;

  if (email === normalizedQuery) score += 130;
  if (email.startsWith(normalizedQuery)) score += 120;
  if (emailLocalPart.startsWith(normalizedQuery)) score += 110;
  if (email.includes(normalizedQuery)) score += 90;
  if (name === normalizedQuery) score += 100;
  if (name.startsWith(normalizedQuery)) score += 85;
  if (firstName.startsWith(firstToken)) score += 75;
  if (surname.startsWith(lastToken)) score += 65;
  if (coach.nameParts.some((part) => part.startsWith(firstToken))) score += 45;
  if (coach.emailParts.some((part) => part.startsWith(firstToken))) score += 25;
  if (coach.searchText.includes(compactQuery)) score += 20;
  if (tokens.every((token) => coach.searchText.includes(token))) score += 10;

  return score;
}

export function buildCoachSuggestions(
  coaches: Array<IndexedCoach | CoachSearchRecord>,
  query: string,
  limit = 6,
) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  return coaches
    .map((coach) => {
      const indexedCoach = hasSearchText(coach) ? coach : indexCoach(coach);
      return {
        coach: indexedCoach,
        score: scoreCoachSuggestion(indexedCoach, normalizedQuery),
        matchLabel: indexedCoach.email.toLowerCase().includes(normalizedQuery)
          ? indexedCoach.email
          : indexedCoach.name,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.coach.name.localeCompare(b.coach.name);
    })
    .slice(0, limit);
}
