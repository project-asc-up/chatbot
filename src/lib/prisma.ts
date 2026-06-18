import { PrismaClient } from "@/generated/prisma/client";

import { createDatabaseAdapter } from "@/lib/db-adapter";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function resolveUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DIRECT_URL
  );
}

function createPrismaClient() {
  const url = resolveUrl();

  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  const adapter = createDatabaseAdapter(url);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
