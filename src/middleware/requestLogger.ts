import type { App } from "@slack/bolt";

import { logger } from "../utils/logger";

export function registerRequestLogger(app: App): void {
  app.use(async ({ body, next }) => {
    logger.debug("Slack request received", {
      type: body.type,
      teamId: "team_id" in body ? body.team_id : undefined,
    });

    await next();
  });
}
