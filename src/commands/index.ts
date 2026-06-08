import type { App } from "@slack/bolt";

import { registerPingCommand } from "./ping";

export function registerCommands(app: App): void {
  registerPingCommand(app);
}
