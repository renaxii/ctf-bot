export type NodeEnv = "development" | "test" | "production";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface SlackConfig {
  botToken: string;
  signingSecret?: string;
  socketMode: boolean;
  appToken?: string;
}

export interface AppConfig {
  env: NodeEnv;
  logLevel: LogLevel;
  port: number;
  databaseUrl: string;
  slack: SlackConfig;
}
