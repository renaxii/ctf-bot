import type { App } from "@slack/bolt";

export type CommandRegistrar = (app: App) => void;
