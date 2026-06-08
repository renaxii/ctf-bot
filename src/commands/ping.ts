import type { App } from "@slack/bolt";

import { healthService } from "../services/healthService";
import { logger } from "../utils/logger";

export function registerPingCommand(app: App): void {
  app.command("/ping", async ({ ack, command, respond }) => {
    await ack();

    logger.info("Slash command received", {
      command: command.command,
      teamId: command.team_id,
      userId: command.user_id,
    });

    await respond({
      response_type: "ephemeral",
      text: healthService.ping(),
    });
  });
}
