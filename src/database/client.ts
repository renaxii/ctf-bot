import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

import { config } from "../config";
import { logger } from "../utils/logger";

const adapter = new PrismaBetterSqlite3({
  url: config.databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("query", (event) => {
  logger.debug("Prisma query executed", {
    duration: event.duration,
    query: event.query,
  });
});

prisma.$on("warn", (event) => {
  logger.warn("Prisma warning", event);
});

prisma.$on("error", (event) => {
  logger.error("Prisma error", event);
});

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info("Database connected");
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
