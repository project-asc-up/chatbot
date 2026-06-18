import { PrismaPg } from "@prisma/adapter-pg";

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function normalizeConnectionString(connectionString: string) {
  const url = new URL(connectionString);

  if (isLocalHost(url.hostname)) {
    url.searchParams.delete("sslmode");
  }

  return url.toString();
}

export function createDatabaseAdapter(connectionString: string) {
  const normalizedConnectionString = normalizeConnectionString(connectionString);

  return new PrismaPg({ connectionString: normalizedConnectionString });
}
