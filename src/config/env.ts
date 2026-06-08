import dotenv from "dotenv";

import type { AppConfig, LogLevel, NodeEnv } from "../types/config";

dotenv.config();

const nodeEnvs = ["development", "test", "production"] as const;
const logLevels = ["debug", "info", "warn", "error"] as const;

function readRequired(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function readOptional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

function readEnum<T extends readonly string[]>(
  name: string,
  allowedValues: T,
  fallback: T[number],
): T[number] {
  const value = readOptional(name, fallback);

  if (!allowedValues.includes(value)) {
    throw new Error(
      `Invalid ${name}: "${value}". Expected one of: ${allowedValues.join(", ")}`,
    );
  }

  return value;
}

function readPort(name: string, fallback: number): number {
  const value = readOptional(name, String(fallback));
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid ${name}: "${value}". Expected a port from 1 to 65535.`);
  }

  return port;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = readOptional(name, String(fallback)).toLowerCase();

  if (["true", "1", "yes", "y"].includes(value)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(value)) {
    return false;
  }

  throw new Error(`Invalid ${name}: "${value}". Expected true or false.`);
}

export function loadConfig(): AppConfig {
  const socketMode = readBoolean("SLACK_SOCKET_MODE", false);
  const signingSecret = process.env.SLACK_SIGNING_SECRET?.trim();
  const appToken = process.env.SLACK_APP_TOKEN?.trim();

  if (!socketMode && !signingSecret) {
    throw new Error("Missing required environment variable: SLACK_SIGNING_SECRET");
  }

  if (socketMode && !appToken) {
    throw new Error("Missing required environment variable: SLACK_APP_TOKEN");
  }

  return {
    env: readEnum("NODE_ENV", nodeEnvs, "development") as NodeEnv,
    logLevel: readEnum("LOG_LEVEL", logLevels, "info") as LogLevel,
    port: readPort("PORT", 3000),
    databaseUrl: readRequired("DATABASE_URL"),
    slack: {
      botToken: readRequired("SLACK_BOT_TOKEN"),
      signingSecret,
      socketMode,
      appToken,
    },
  };
}
