import { ExpressApp } from "./express-app";
import { logger } from "./utils/logger";
import * as cfg from "./config";

export const startServer = async () => {
  const expressApp = await ExpressApp();

  expressApp.listen(cfg.APP_PORT, () => {
    logger.info(`App is listening to ${cfg.APP_PORT}`);
  });
  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });
};

startServer().then(() => {
  logger.info("server is up");
});
