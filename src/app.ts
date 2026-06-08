import { App } from "@slack/bolt";

import { registerCommands } from "./commands";
import { config } from "./config";
import { connectDatabase, disconnectDatabase } from "./database/client";
import { registerErrorHandlers } from "./middleware/errorHandler";
import { registerRequestLogger } from "./middleware/requestLogger";
import { logger } from "./utils/logger";
import { serializeError } from "./utils/errors";

const app = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
  socketMode: config.slack.socketMode,
  appToken: config.slack.appToken,
});

registerErrorHandlers(app);
registerRequestLogger(app);
registerCommands(app);

async function start(): Promise<void> {
  try {
    await connectDatabase();
    await app.start(config.port);

    logger.info("Slack CTF Bot started", {
      env: config.env,
      port: config.port,
      socketMode: config.slack.socketMode,
    });
  } catch (error) {
    logger.error("Failed to start Slack CTF Bot", serializeError(error));
    await disconnectDatabase();
    process.exit(1);
  }
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  logger.info("Shutdown signal received", { signal });

  try {
    await app.stop();
    await disconnectDatabase();
    logger.info("Slack CTF Bot stopped");
    process.exit(0);
  } catch (error) {
    logger.error("Failed during shutdown", serializeError(error));
    process.exit(1);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

void start();
