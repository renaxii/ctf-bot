import type { App } from "@slack/bolt";

import { logger } from "../utils/logger";
import { serializeError } from "../utils/errors";

export function registerErrorHandlers(app: App): void {
  app.error(async (error) => {
    logger.error("Unhandled Slack application error", serializeError(error));
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", serializeError(reason));
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", serializeError(error));
    process.exit(1);
  });
}
